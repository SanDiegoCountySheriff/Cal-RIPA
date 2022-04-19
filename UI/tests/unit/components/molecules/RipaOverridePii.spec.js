import RipaOverridePii from '@/components/molecules/RipaOverridePii.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Override PII', () => {
  let vuetify
  let wrapper
  let stop
  let apiStop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
    apiStop = API_STOP
  })

  const factory = propsData => {
    return shallowMount(RipaOverridePii, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaOverridePii, {
      vuetify,
      propsData: {
        value: stop,
        apiStop: apiStop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
