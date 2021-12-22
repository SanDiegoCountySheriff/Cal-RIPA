import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFormContainerMixin from '@/components/mixins/RipaFormContainerMixin'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Form Container', () => {
  let vuetify
  let store
  let state
  let actions
  let getters
  let wrapper = null
  let apiStop

  beforeEach(() => {
    localStorage.clear()
    vuetify = new Vuetify()
    state = {
      isOnline: true,
      authentication: {
        isAuthenticated: true,
      },
    }
    actions = {
      editOfficerUser: jest.fn(),
      checkTextForPii: jest.fn(),
      setPiiServiceAvailable: jest.fn(),
    }
    getters = {
      mappedGpsLocationAddress: jest.fn(),
      mappedFormBeats: jest.fn(),
      mappedFormCountyCities: jest.fn(),
      displayBeatInput: jest.fn(),
      displayDebugger: jest.fn(),
      isAuthenticated: jest.fn(),
      isOnlineAndAuthenticated: jest.fn(() => {
        return state.isOnline && state.authentication.isAuthenticated
      }),
      mappedFormNonCountyCities: jest.fn(),
      mappedFormSchools: jest.fn(),
      mappedFormStatutes: jest.fn(),
      mappedUser: jest.fn().mockReturnValue({ agency: 'SDSD', assignment: 1 }),
      stopTemplates: jest.fn(),
      invalidUser: jest.fn().mockReturnValue(false),
    }
    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations: {
        setIsOnline(state, value) {
          state.isOnline = value
        },
      },
    })
    apiStop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaFormContainer, {
      vuetify,
      store,
      localVue,
      propsData: {
        ...propsData,
      },
      mixins: [RipaApiStopJobMixin, RipaFormContainerMixin],
    })
  }

  const shallowFactory

  const adminFactory = propsData => {
    return mount(RipaFormContainer, {
      vuetify,
      store,
      localVue,
      propsData: {
        ...propsData,
      },
      mixins: [RipaApiStopJobMixin, RipaFormContainerMixin],
      computed: {
        isAdminEditing: {
          get() {
            return true
          },
        },
      },
    })
  }

  const piiTestCases = [
    { source: 'location', expectedCalls: [1, 0, 0] },
    { source: 'reason', expectedCalls: [0, 1, 0] },
    { source: 'search', expectedCalls: [0, 0, 1] },
    { source: '', expectedCalls: [0, 0, 0] },
  ]

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should get mapped user', () => {
    wrapper = factory()

    const expectedUser = { agency: 'SDSD' }
    const actualUser = wrapper.vm.getMappedUser

    expect(actualUser).toEqual(expectedUser)
  })

  it('should handle save user', () => {
    wrapper = factory()

    const expectedUser = { agency: 'Sheriff' }

    wrapper.vm.handleSaveUser(expectedUser)

    expect(actions.editOfficerUser).toHaveBeenCalledTimes(1)
  })

  it('should handle submit stop admin and online', () => {
    wrapper = adminFactory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    wrapper.vm.handleSubmitStop(apiStop)

    expect(addApiStop).toHaveBeenCalledTimes(1)
    expect(setLastLocation).toHaveBeenCalledTimes(0)
    expect(wrapper.vm.snackbatNotOnlineVisible).toBeFalsy()
  })

  it('should handle submit stop not admin and online', () => {
    wrapper = factory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    wrapper.vm.handleSubmitStop(apiStop)

    expect(addApiStop).toHaveBeenCalledTimes(1)
    expect(setLastLocation).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.snackbarNotOnlineVisible).toBeFalsy()
  })

  it('should handle submit stop not admin and offline', () => {
    wrapper = factory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    store.commit('setIsOnline', false)
    wrapper.vm.handleSubmitStop(apiStop)

    expect(addApiStop).toHaveBeenCalledTimes(1)
    expect(setLastLocation).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.snackbarNotOnlineVisible).toBeTruthy()
  })

  it('should handle update user', () => {
    wrapper = factory()

    wrapper.vm.handleUpdateUser()

    expect(wrapper.vm.showUserDialog).toBeTruthy()
  })

  piiTestCases.forEach(test => {
    it(`should validate ${test.source}`, async () => {
      wrapper = factory()
      await wrapper.vm.$nextTick()
      wrapper.vm.handleOpenTemplate()
      console.log(wrapper.vm)
      const source = test.source
      const testValue = 'test'

      await wrapper.vm.handlePiiCheck({ source: source, value: testValue })

      expect(wrapper.vm.validateLocationForPii).toHaveBeenCalledTimes(
        test.expectedCalls[0],
      )
      expect(wrapper.vm.validateReasonForStopPii).toHaveBeenCalledTimes(
        test.expectedCalls[1],
      )
      expect(wrapper.vm.validateBasisForSearchPii).toHaveBeenCalledTimes(
        test.expectedCalls[2],
      )
    })
  })
})
