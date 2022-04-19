import RipaNodeTree from '@/components/molecules/RipaNodeTree.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Node Tree', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaNodeTree, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaNodeTree, {
      vuetify,
      propsData: { node: { id: 1, text: 'test' } },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
