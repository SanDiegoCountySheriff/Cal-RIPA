import RipaRace from '@/components/molecules/RipaRace.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import {
  V1_STOP,
  V2_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Race', () => {
  let vuetify
  let wrapper
  let stop
  let v1Stop
  let v2Stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
    v1Stop = V1_STOP
    v2Stop = V2_STOP
  })

  const factory = propsData => {
    return mount(RipaRace, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaRace, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should show Hispanic/Latino(a) if current date < 01/01/24', () => {
    wrapper = factory({ value: v1Stop })

    expect(wrapper.html()).toContain('Hispanic/Latino(a)')
    expect(wrapper.html()).not.toContain('Hispanic/Latine(x)')
  })

  it('should show Hispanic/Latine(x) if current date > 01/01/24', () => {
    wrapper = factory({ value: v2Stop })

    expect(wrapper.html()).not.toContain('Hispanic/Latino(a)')
    expect(wrapper.html()).toContain('Hispanic/Latine(x)')
  })
})
