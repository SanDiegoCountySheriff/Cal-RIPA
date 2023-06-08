import RipaFormStep2 from '@/components/molecules/RipaFormStep2.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { STOP } from '../../constants/RipaFormContainerTestConstants'
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
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep2, {
      vuetify,
      propsData: {
        value: STOP,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
