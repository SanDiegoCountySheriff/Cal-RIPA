import RipaDatePicker from '@/components/atoms/RipaDatePicker.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Date Picker', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaDatePicker, {
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

  it('should emit event', () => {
    wrapper = factory()
    wrapper.vm.model = 'New Value'

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toEqual(1)
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
