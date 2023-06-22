import RipaFormStep4 from '@/components/molecules/RipaFormStep4.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import { STOP } from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Form Step 4', () => {
  let vuetify
  let wrapper
  let store
  let getters

  beforeEach(() => {
    vuetify = new Vuetify()
    getters = {
      personSearchAutomaticallySelected: jest.fn(),
      propertySearchAutomaticallySelected: jest.fn(),
    }
    store = new Vuex.Store({
      getters,
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep4, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep4, {
      vuetify,
      store,
      localVue,
      propsData: {
        value: STOP,
      },
      provide: {
        loadingPiiStep4() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
