import RipaFormSubheader from '@/components/molecules/RipaFormSubheader.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Subheader', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormSubheader, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenStatute: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormSubheader, {
      vuetify,
      propsData: { onOpenStatute: jest.fn() },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
