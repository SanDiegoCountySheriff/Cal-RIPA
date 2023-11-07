import RipaAutocomplete from '@/components/atoms/RipaAutocomplete.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Autocomplete', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaAutocomplete, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const testItems = ['Item 1', 'Item 2']

  it('should match snapshot', () => {
    wrapper = mount(RipaAutocomplete, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should return the correct items with getItems', () => {
    wrapper = factory({ items: testItems })
    expect(wrapper.vm.getItems).toEqual(['Item 1', 'Item 2'])
  })

  it('should return the correct items with multiple getItems', () => {
    wrapper = factory({
      value: ['Code1', 'Code2'],
      items: [{ code: 'Code1' }],
      multiple: true,
      maxSelections: 2,
    })
    expect(wrapper.vm.getItems).toEqual([{ code: 'Code1' }])
  })

  it('should emit event whem model changes', async () => {
    wrapper = factory({ items: testItems })

    wrapper.vm.model = testItems[0]
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toBe(1)
  })

  it('should watch value', async () => {
    wrapper = factory({ items: testItems })
    wrapper.setProps({ value: 'New Value' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.viewModel).toEqual('New Value')
  })

  it('should handleRemoveItem', () => {
    wrapper = factory({ items: testItems })

    wrapper.vm.handleRemoveItem({ test: 'test' })

    expect(wrapper.emitted('remove-item')).toBeTruthy()
    expect(wrapper.emitted('remove-item')[0]).toEqual([{ test: 'test' }])
  })
})
