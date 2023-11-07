import RipaFormStep4 from '@/components/molecules/RipaFormStep4.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import { V1_STOP } from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { computed } from 'vue'

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
        value: V1_STOP,
      },
      provide: {
        loadingPiiStep4: computed(() => false),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
