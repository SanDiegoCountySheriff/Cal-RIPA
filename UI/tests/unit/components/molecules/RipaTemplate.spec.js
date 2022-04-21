import RipaTemplate from '@/components/molecules/RipaTemplate.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Template', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaTemplate, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenTemplate: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaTemplate, {
      vuetify,
      propsData: {
        onOpenTemplate: jest.fn(),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.todo('should handle dynamic templates')

  it.todo('should handle default template')
})
