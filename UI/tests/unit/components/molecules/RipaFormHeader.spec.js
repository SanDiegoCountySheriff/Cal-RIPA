import RipaFormHeader from '@/components/molecules/RipaFormHeader.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Header', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormHeader, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenStatute: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormHeader, {
      vuetify,
      propsData: {
        onOpenStatute: jest.fn(),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
