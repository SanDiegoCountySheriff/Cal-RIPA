import RipaCheckGroup from '@/components/atoms/RipaCheckGroup.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Check Group', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaCheckGroup, {
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

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.setProps({ value: ['Test1', 'Test2'] })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual(['Test1', 'Test2'])
  })
})
