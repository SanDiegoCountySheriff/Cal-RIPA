import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import {
  PII_TEST_CASES,
  LOCATION_PII_TEST_CASES,
  REASON_PII_TEST_CASES,
} from '../../constants/RipaFormContainerConstants'
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
    const officer = {
      agency: 'SDSD',
      assignment: 1,
      officerId: '000000001',
      officerName: 'John Smith',
      otherType: null,
      startDate: '2020-12-12',
      yearsExperience: 10,
    }
    localStorage.setItem('ripa_officer', JSON.stringify(officer))
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
      mappedUser: jest.fn().mockReturnValue({
        agency: 'SDSD',
        assignment: 1,
        officerId: '000000001',
        officerName: 'John Smith',
        otherType: null,
        startDate: '2020-12-12',
        yearsExperience: 10,
      }),
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

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should get mapped user', () => {
    wrapper = factory()

    const expectedUser = {
      agency: 'SDSD',
      assignment: 1,
      otherType: null,
      startDate: '2020-12-12',
      yearsExperience: 10,
    }
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

  PII_TEST_CASES.forEach(test => {
    it(`should validate ${test.source}`, async () => {
      wrapper = factory()
      wrapper.vm.handleOpenTemplate()
      const source = test.source
      const testValue = 'test'
      const validateLocationForPii = jest.spyOn(
        wrapper.vm,
        'validateLocationForPii',
      )
      const validateReasonForStopForPii = jest.spyOn(
        wrapper.vm,
        'validateReasonForStopForPii',
      )
      const validateBasisForSearchForPii = jest.spyOn(
        wrapper.vm,
        'validateBasisForSearchForPii',
      )

      await wrapper.vm.handlePiiCheck({ source: source, value: testValue })

      expect(validateLocationForPii).toHaveBeenCalledTimes(
        test.expectedCalls[0],
      )
      expect(validateReasonForStopForPii).toHaveBeenCalledTimes(
        test.expectedCalls[1],
      )
      expect(validateBasisForSearchForPii).toHaveBeenCalledTimes(
        test.expectedCalls[2],
      )
    })

    LOCATION_PII_TEST_CASES.forEach(test => {
      it(`should validate location for pii test number: ${test.testNumber}`, async () => {
        wrapper = factory()
        wrapper.vm.handleOpenTemplate()
        if (test.setStopPiiEntities) {
          wrapper.vm.stop.isPiiFound = true
          wrapper.vm.stop.stopReason.reasonForStopPiiFound = true
          wrapper.vm.stop.piiEntities = [
            {
              entityText: 'John Smith',
              confidenceScore: '50',
              category: 'Name',
              source: 'Basis for Search Person: ',
            },
          ]
        }
        const textValue = test.testValue
        const checkTextForPii = jest.spyOn(wrapper.vm, 'checkTextForPii')
        checkTextForPii.mockReturnValue(test.checkTextForPiiReturnValue)
        const setPiiServiceAvailable = jest.spyOn(
          wrapper.vm,
          'setPiiServiceAvailable',
        )

        await wrapper.vm.validateLocationForPii(textValue)

        expect(checkTextForPii).toBeCalledTimes(test.checkTextForPiiCalledTimes)
        expect(setPiiServiceAvailable).toBeCalledTimes(
          test.setPiiServiceAvailableCalledTimes,
        )
        expect(wrapper.vm.stop.location.piiFound).toEqual(test.locationPiiFound)
        expect(wrapper.vm.stop.isPiiFound).toEqual(test.stopPiiFound)
        expect(wrapper.vm.stop.piiEntities).toEqual(test.expectedPiiEntities)
      })
    })

    REASON_PII_TEST_CASES.forEach(test => {
      it(`should validate reason for pii test number: ${test.testNumber}`, async () => {
        wrapper = factory()
        wrapper.vm.handleOpenTemplate()
        if (test.setStopPiiEntities) {
          wrapper.vm.stop.isPiiFound = true
          wrapper.vm.stop.location.piiFound = true
          wrapper.vm.stop.piiEntities = [
            {
              entityText: 'John Smith',
              confidenceScore: '50',
              category: 'Name',
              source: 'Location',
            },
          ]
        }
        const textValue = test.testValue
        const checkTextForPii = jest.spyOn(wrapper.vm, 'checkTextForPii')
        checkTextForPii.mockReturnValue(test.checkTextForPiiReturnValue)
        const setPiiServiceAvailable = jest.spyOn(
          wrapper.vm,
          'setPiiServiceAvailable',
        )

        await wrapper.vm.validateReasonForStopForPii(textValue)

        expect(checkTextForPii).toBeCalledTimes(test.checkTextForPiiCalledTimes)
        expect(setPiiServiceAvailable).toBeCalledTimes(
          test.setPiiServiceAvailableCalledTimes,
        )
        expect(wrapper.vm.stop.location.piiFound).toEqual(test.locationPiiFound)
        expect(wrapper.vm.stop.isPiiFound).toEqual(test.stopPiiFound)
        expect(wrapper.vm.stop.piiEntities).toEqual(test.expectedPiiEntities)
      })
    })
  })
})
