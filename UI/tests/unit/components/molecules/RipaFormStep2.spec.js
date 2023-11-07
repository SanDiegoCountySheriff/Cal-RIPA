import RipaFormStep2 from '@/components/molecules/RipaFormStep2.vue'
import { shallowMount, mount } from '@vue/test-utils'
import {
  V1_STOP,
  V2_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Form Step 2', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep2, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        loadingPiiStep1() {
          return false
        },
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep2, {
      vuetify,
      propsData: {
        value: V1_STOP,
      },
      provide: {
        loadingPiiStep1() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display perceived unhoused for v2 stop', () => {
    wrapper = mount(RipaFormStep2, {
      vuetify,
      propsData: {
        value: V2_STOP,
      },
    })

    expect(wrapper.html()).toContain('Perceived Unhoused')
  })

  it('should not display perceived unhoused for legacy stop', () => {
    wrapper = mount(RipaFormStep2, {
      vuetify,
      propsData: {
        value: V1_STOP,
      },
    })

    expect(wrapper.html()).not.toContain('Perceived Unhoused')
  })
})
