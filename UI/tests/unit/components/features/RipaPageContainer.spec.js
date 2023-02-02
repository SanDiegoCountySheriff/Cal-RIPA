import RipaPageContainer from '@/components/features/RipaPageContainer'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import router from '@/router'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Page Container', () => {
  let vuetify
  let wrapper
  let store
  let actions
  let mutations
  let getters

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => true)
    const officer = {
      agency: 'SDSD',
      assignment: 1,
      officerId: '000000001',
      officerName: 'John Smith',
      otherType: null,
      startDate: '2020-12-12',
      yearsExperience: 10,
    }
    vuetify = new Vuetify()
    actions = {
      setStopsWithErrors: jest.fn(),
      setConnectionStatus: jest.fn(),
    }
    getters = {
      invalidUser: jest.fn(),
      mappedUser: jest.fn().mockReturnValue(officer),
      isAdmin: jest.fn(),
      isAuthenticated: jest.fn(),
      environmentName: jest.fn(),
      isOnline: jest.fn(),
      mappedStopsWithErrors: jest.fn(),
      isOnlineAndAuthenticated: jest.fn(),
      isApiUnavailable: jest.fn(),
      mappedStopSubmissionPassedIds: jest.fn(),
      mappedStopSubmissionStatus: jest.fn(),
      mappedStopSubmissionFailedStops: jest.fn(),
    }
    store = new Vuex.Store({ actions, getters })
  })

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  const factory = propsData => {
    return mount(RipaPageContainer, {
      localVue,
      store,
      vuetify,
      router,
      propsData: {
        ...propsData,
      },
      provide: {
        user: () => {},
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not delete errored stop from local storage when editing', () => {
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
    wrapper = factory()
    wrapper.vm.handleOpenStopWithError('1')

    const actual = localStorage.getItem('ripa_submitted_api_stops_with_errors')

    expect(actual).not.toEqual(null)
  })
})
