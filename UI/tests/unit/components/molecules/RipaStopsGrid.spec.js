import RipaStopsGrid from '@/components/molecules/RipaStopsGrid.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Stops Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaStopsGrid, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopsGrid, {
      vuetify,
      propsData: {
        errorCodeSearch: {
          items: [],
          loading: false,
          search: null,
          select: null,
        },
        items: { summary: null },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
