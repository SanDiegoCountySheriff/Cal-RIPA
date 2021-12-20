import RipaDatePicker from '@/components/atoms/RipaDatePicker.vue'
import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Date Picker', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return mount(RipaDatePicker, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit event', () => {
    wrapper = factory()
    wrapper.vm.model = 'New Value'

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toEqual(1)
  })
})
