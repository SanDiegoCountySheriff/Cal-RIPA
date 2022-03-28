import RipaTemplate from '@/components/molecules/RipaTemplate.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Template', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaTemplate, {
      vuetify,
      propsData: {
        onOpenTemplate: jest.fn(),
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it.todo('should handle dynamic templates')

  it.todo('should handle default template')
})
