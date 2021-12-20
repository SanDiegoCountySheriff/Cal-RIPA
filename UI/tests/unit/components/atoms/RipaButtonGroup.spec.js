import RipaButtonGroup from '@/components/atoms/RipaButtonGroup.vue'
import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Button Group', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return mount(RipaButtonGroup, {
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
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit event whem model changes', async () => {
    wrapper = factory({ items: testItems })

    wrapper.vm.model = 'Item 1'
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input').length).toBe(1)
  })
})
