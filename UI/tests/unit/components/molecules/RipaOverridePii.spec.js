import RipaOverridePii from '@/components/molecules/RipaOverridePii.vue'
import { shallowMount } from '@vue/test-utils'
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

  afterEach(() => {
    wrapper.destroy()
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
    wrapper = factory({ value: stop, apiStop: apiStop })

    expect(wrapper.element).toMatchSnapshot()
  })
})