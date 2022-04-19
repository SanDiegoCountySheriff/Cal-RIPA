import RipaFormStep7 from '@/components/molecules/RipaFormStep7.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'

import Vuetify from 'vuetify'

describe('Ripa Form Step 7', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep7, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    const apiStop = API_STOP
    wrapper = mount(RipaFormStep7, {
      vuetify,
      propsData: { apiStop: apiStop },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
