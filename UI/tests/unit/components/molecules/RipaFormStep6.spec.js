import RipaFormStep6 from '@/components/molecules/RipaFormStep6.vue'
import { STOP } from '../../constants/RipaFormContainerTestConstants'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Step 6', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep6, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep6, {
      vuetify,
      propsData: {
        value: STOP,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
