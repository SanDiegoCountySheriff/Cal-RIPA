import RipaCheckbox from '@/components/atoms/RipaCheckbox.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Checkbox', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaCheckbox, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ label: 'Item 1' })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit event whem model changes', async () => {
    wrapper = factory({ label: 'Item 1' })

    wrapper.vm.model = !wrapper.vm.model
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toBe(1)
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.setProps({ value: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual(true)
  })
})
