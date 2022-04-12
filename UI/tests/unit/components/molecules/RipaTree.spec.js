import RipaTree from '@/components/molecules/RipaTree.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Tree', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
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
    wrapper = mount(RipaTree, {
      vuetify,
      propsData: {
        treeData: { id: 1, text: 'test' },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
