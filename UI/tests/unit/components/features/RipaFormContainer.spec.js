import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import {
  PII_TEST_CASES,
  LOCATION_PII_TEST_CASES,
  REASON_PII_TEST_CASES,
  BASIS_FOR_SEARCH_PII_TEST_CASES,
  API_STOP,
  FULL_STOP,
  STOP,
} from '../../constants/RipaFormContainerTestConstants'
import { defaultStop } from '@/utilities/stop.js'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFormContainerMixin from '@/components/mixins/RipaFormContainerMixin'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Form Container', () => {
  const app = document.createElement('div')
  app.setAttribute('data-app', true)
  document.body.append(app)

  let vuetify
  let store
  let state
  let actions
  let getters
  let mutations
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
      mappedGpsLocationAddress: null,
    }
    actions = {
      editOfficerUser: jest.fn(),
      checkTextForPii: jest.fn(),
      setPiiServiceAvailable: jest.fn(),
      setStopsWithErrors: jest.fn(),
      resetStopSubmissionStatus: jest.fn(),
      submitOfficerStop: jest.fn(),
    }
    getters = {
      displayReportingEmail: jest.fn(),
      reportingEmailAddress: jest.fn(),
      isOnline: jest.fn(),
      mappedGpsLocationAddress: jest.fn(() => {
        return state.mappedGpsLocationAddress
      }),
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
      mappedUser: jest.fn().mockReturnValue(officer),
      stopTemplates: jest.fn(),
      invalidUser: jest.fn().mockReturnValue(false),
      isApiUnavailable: jest.fn(),
      isAdmin: jest.fn(),
      mappedStopSubmissionPassedIds: jest.fn().mockReturnValue([]),
      resetStopSubmissionStatus: jest.fn(),
      mappedStopSubmissionFailedIds: jest.fn().mockReturnValue([]),
      mappedStopSubmissionStatus: jest.fn(),
      mappedStopSubmissionFailedStops: jest.fn().mockReturnValue([]),
    }
    mutations = {
      setIsOnline: (state, value) => {
        state.isOnline = value
      },
      setMappedGpsLocationAddress: (state, value) => {
        state.mappedGpsLocationAddress = value
      },
    }
    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations,
    })
    apiStop = defaultStop()
  })

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaFormContainer, {
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
    return shallowMount(RipaFormContainer, {
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

  const mountFactory = propsData => {
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

  it('should handle submit stop admin and online', async () => {
    wrapper = adminFactory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const submitOfficerStopOnline = jest.spyOn(
      wrapper.vm,
      'submitOfficerStopOnline',
    )
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    await wrapper.vm.handleSubmitStop(apiStop)

    expect(submitOfficerStopOnline).toHaveBeenCalledTimes(1)
    expect(addApiStop).toHaveBeenCalledTimes(0)
    expect(setLastLocation).toHaveBeenCalledTimes(0)
    expect(wrapper.vm.snackbatNotOnlineVisible).toBeFalsy()
  })

  it('should handle submit stop not admin and online', async () => {
    wrapper = factory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const submitOfficerStopOnline = jest.spyOn(
      wrapper.vm,
      'submitOfficerStopOnline',
    )
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    await wrapper.vm.handleSubmitStop(apiStop)

    expect(submitOfficerStopOnline).toHaveBeenCalledTimes(1)
    expect(addApiStop).toHaveBeenCalledTimes(0)
    expect(setLastLocation).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.snackbarNotOnlineVisible).toBeFalsy()
  })

  it('should handle submit stop not admin and offline', async () => {
    wrapper = factory()
    const addApiStop = jest.spyOn(wrapper.vm, 'addApiStop')
    const submitOfficerStopOnline = jest.spyOn(
      wrapper.vm,
      'submitOfficerStopOnline',
    )
    const setLastLocation = jest.spyOn(wrapper.vm, 'setLastLocation')

    store.commit('setIsOnline', false)
    await wrapper.vm.handleSubmitStop(apiStop)

    expect(submitOfficerStopOnline).toHaveBeenCalledTimes(0)
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
            source: 'Stop Reason Person: 1',
          },
        ]
      }
      const checkTextForPii = jest.spyOn(wrapper.vm, 'checkTextForPii')
      checkTextForPii.mockReturnValue(test.checkTextForPiiReturnValue)
      const setPiiServiceAvailable = jest.spyOn(
        wrapper.vm,
        'setPiiServiceAvailable',
      )

      await wrapper.vm.validateLocationForPii(test.testValue)

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
      const checkTextForPii = jest.spyOn(wrapper.vm, 'checkTextForPii')
      checkTextForPii.mockReturnValue(test.checkTextForPiiReturnValue)
      const setPiiServiceAvailable = jest.spyOn(
        wrapper.vm,
        'setPiiServiceAvailable',
      )

      await wrapper.vm.validateReasonForStopForPii(test.testValue)

      expect(checkTextForPii).toBeCalledTimes(test.checkTextForPiiCalledTimes)
      expect(setPiiServiceAvailable).toBeCalledTimes(
        test.setPiiServiceAvailableCalledTimes,
      )
      expect(wrapper.vm.stop.stopReason.reasonForStopPiiFound).toEqual(
        test.reasonForStopPiiFound,
      )
      expect(wrapper.vm.stop.isPiiFound).toEqual(test.stopPiiFound)
      expect(wrapper.vm.stop.piiEntities).toEqual(test.expectedPiiEntities)
    })
  })

  BASIS_FOR_SEARCH_PII_TEST_CASES.forEach(test => {
    it(`should validate basis for search pii test number ${test.testNumber}`, async () => {
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
      const checkTextForPii = jest.spyOn(wrapper.vm, 'checkTextForPii')
      checkTextForPii.mockReturnValue(test.checkTextForPiiReturnValue)
      const setPiiServiceAvailable = jest.spyOn(
        wrapper.vm,
        'setPiiServiceAvailable',
      )

      await wrapper.vm.validateBasisForSearchForPii(test.testValue)

      expect(checkTextForPii).toBeCalledTimes(test.checkTextForPiiCalledTimes)
      expect(setPiiServiceAvailable).toBeCalledTimes(
        test.setPiiServiceAvailableCalledTimes,
      )
      expect(wrapper.vm.stop.actionsTaken.basisForSearchPiiFound).toEqual(
        test.expectedBasisForSearchPiiFound,
      )
      expect(wrapper.vm.stop.isPiiFound).toEqual(test.stopPiiFound)
      expect(wrapper.vm.stop.piiEntities).toEqual(test.expectedPiiEntities)
    })
  })

  it('should watch mappedGpsLocationAddress', async () => {
    wrapper = factory()
    wrapper.vm.handleOpenTemplate()

    expect(wrapper.vm.lastLocation).toEqual(null)

    store.commit('setMappedGpsLocationAddress', '1000 Anystreet')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.lastLocation).toEqual({
      newLocation: '1000 Anystreet',
      persistSchool: true,
    })
  })

  it('should not delete errored stop from memory when canceling edit', async () => {
    localStorage.setItem(
      'ripa_submitted_api_stops_with_errors',
      JSON.stringify([
        {
          internalId: '1',
          apiStop: API_STOP,
          statusCode: 400,
          statusError: 'This appears to be a duplicate Stop',
        },
      ]),
    )
    localStorage.setItem('ripa_errored_stop_internal_id', '1')
    localStorage.setItem('ripa_form_step_index', '7')
    localStorage.setItem('ripa_form_editing', '1')
    localStorage.setItem('ripa_form_editing_stop_with_error', '1')
    localStorage.setItem('ripa_form_stop', JSON.stringify(STOP))
    localStorage.setItem('ripa_form_full_stop', JSON.stringify(FULL_STOP))
    localStorage.setItem('ripa_form_api_stop', JSON.stringify(API_STOP))
    localStorage.setItem(
      'ripa_form_submitted_api_stop',
      JSON.stringify(API_STOP),
    )
    localStorage.setItem('ripa_form_cached', '1')
    localStorage.setItem('ripa_form_submitted_submissions', JSON.stringify([]))
    wrapper = mountFactory()
    await wrapper.vm.$nextTick()
    wrapper.vm.handleCancelAction()

    const actual = localStorage.getItem('ripa_submitted_api_stops_with_errors')

    expect(actual).not.toEqual(null)
  })

  it('should delete errored stop from memory when submitting edit', async () => {
    localStorage.setItem(
      'ripa_submitted_api_stops_with_errors',
      JSON.stringify([
        {
          internalId: '1',
          apiStop: API_STOP,
          statusCode: 400,
          statusError: 'This appears to be a duplicate Stop',
        },
      ]),
    )
    localStorage.setItem('ripa_errored_stop_internal_id', '1')
    localStorage.setItem('ripa_form_step_index', '7')
    localStorage.setItem('ripa_form_editing', '1')
    localStorage.setItem('ripa_form_editing_stop_with_error', '1')
    localStorage.setItem('ripa_form_stop', JSON.stringify(STOP))
    localStorage.setItem('ripa_form_full_stop', JSON.stringify(FULL_STOP))
    localStorage.setItem('ripa_form_api_stop', JSON.stringify(API_STOP))
    localStorage.setItem(
      'ripa_form_submitted_api_stop',
      JSON.stringify(API_STOP),
    )
    localStorage.setItem('ripa_form_cached', '1')
    localStorage.setItem('ripa_form_submitted_submissions', JSON.stringify([]))
    wrapper = mountFactory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.handleSubmitStop()

    const actual = localStorage.getItem('ripa_submitted_api_stops_with_errors')

    expect(actual).toEqual(null)
  })

  it('should only delete submitted stop from memory when submitting edit', async () => {
    localStorage.setItem(
      'ripa_submitted_api_stops_with_errors',
      JSON.stringify([
        {
          internalId: '1',
          apiStop: API_STOP,
          statusCode: 400,
          statusError: 'This appears to be a duplicate Stop',
        },
        {
          internalId: '2',
          apiStop: API_STOP,
          statusCode: 400,
          statusError: 'This appears to be a duplicate Stop',
        },
      ]),
    )
    const expected = JSON.stringify([
      {
        internalId: '2',
        apiStop: API_STOP,
        statusCode: 400,
        statusError: 'This appears to be a duplicate Stop',
      },
    ])
    localStorage.setItem('ripa_errored_stop_internal_id', '1')
    localStorage.setItem('ripa_form_step_index', '7')
    localStorage.setItem('ripa_form_editing', '1')
    localStorage.setItem('ripa_form_editing_stop_with_error', '1')
    localStorage.setItem('ripa_form_stop', JSON.stringify(STOP))
    localStorage.setItem('ripa_form_full_stop', JSON.stringify(FULL_STOP))
    localStorage.setItem('ripa_form_api_stop', JSON.stringify(API_STOP))
    localStorage.setItem(
      'ripa_form_submitted_api_stop',
      JSON.stringify(API_STOP),
    )
    localStorage.setItem('ripa_form_cached', '1')
    localStorage.setItem('ripa_form_submitted_submissions', JSON.stringify([]))
    wrapper = mountFactory()
    await wrapper.vm.$nextTick()
    await wrapper.vm.handleSubmitStop()

    const actual = localStorage.getItem('ripa_submitted_api_stops_with_errors')

    expect(actual).toEqual(expected)
  })

  it.todo('should mount when not editing local form')
})
