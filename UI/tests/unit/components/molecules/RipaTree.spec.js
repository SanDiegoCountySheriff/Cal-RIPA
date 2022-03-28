import RipaTree from '@/components/molecules/RipaTree.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Tree', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaTree, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ treeData: { id: 1, text: 'test' } })

    expect(wrapper.element).toMatchSnapshot()
  })
})
