import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Form Container', () => {
  let vuetify
  let store
  let actions
  let getters
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
    actions = {}
    getters = {
      mappedGpsLocationAddress: jest.fn(),
      mappedFormBeats: jest.fn(),
      mappedFormCountyCities: jest.fn(),
      displayBeatInput: jest.fn(),
      displayDebugger: jest.fn(),
      isAuthenticated: jest.fn(),
      isOnlineAndAuthenticated: jest.fn(),
      mappedFormNonCountyCities: jest.fn(),
      mappedFormSchools: jest.fn(),
      mappedFormStatutes: jest.fn(),
      mappedUser: jest.fn(() => {
        return { agency: 'SDSD' }
      }),
      stopTemplates: jest.fn(),
    }
    store = new Vuex.Store({
      actions,
      getters,
    })
  })

  const factory = propsData => {
    return mount(RipaFormContainer, {
      vuetify,
      store,
      localVue,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
