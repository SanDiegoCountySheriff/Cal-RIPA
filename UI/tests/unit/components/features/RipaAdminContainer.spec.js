import RipaAdminContainer from '@/components/features/RipaAdminContainer'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe('Ripa Admin Container', () => {
  let wrapper
  let vuetify
  let actions
  let getters
  let store
  const routes = [
    {
      path: '/',
      component: RipaAdminContainer,
    },
  ]
  const router = new VueRouter({ routes })

  beforeEach(() => {
    vuetify = new Vuetify()
    actions = {
      getAdminStops: jest.fn(),
    }
    getters = {
      mappedAdminBeats: jest.fn(),
      mappedUser: jest.fn(),
      mappedAdminCities: jest.fn(),
      mappedAdminSchools: jest.fn(),
      mappedAdminStatutes: jest.fn(),
      mappedAdminStops: jest.fn(),
      mappedAdminSubmissions: jest.fn(),
      mappedAdminSubmission: jest.fn(),
      mappedAdminUsers: jest.fn(),
      mappedErrorCodeAdminSearch: jest.fn(),
      displayBeatInput: jest.fn(),
      mappedAdminHistoricalCpraReports: jest.fn(),
      mappedAdminCpraReportStats: jest.fn(),
      stopQueryData: jest.fn(),
    }
    store = new Vuex.Store({
      actions,
      getters,
    })
  })

  const factory = propsData => {
    return shallowMount(RipaAdminContainer, {
      router,
      store,
      localVue,
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
