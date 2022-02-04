import RipaHeader from '@/components/atoms/RipaHeader.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Header', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaHeader, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should display value', () => {
    wrapper = factory({ value: 'Value' })
    expect(wrapper.html()).toContain('Value')
  })
})
