import RipaButtonGroup from '@/components/atoms/RipaButtonGroup.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Button Group', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaButtonGroup, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const testItems = [
    { name: 'Item 1', value: 'Item 1' },
    { name: 'Item 2', value: 'Item 2' },
  ]

  it('should match snapshot', () => {
    wrapper = factory()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit event whem model changes', async () => {
    wrapper = factory({ items: testItems })

    wrapper.vm.model = testItems[0].value
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toBe(1)
  })

  it('should update viewModel when value changes', async () => {
    wrapper = factory({ items: testItems })

    wrapper.setProps({ value: 2 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual(2)
  })
})
