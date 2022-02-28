import RipaStopsGrid from '@/components/molecules/RipaStopsGrid.vue'
import { shallowMount } from '@vue/test-utils'
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
    wrapper = factory({
      savedFilters: { isPiiFound: false },
      errorCodeSearch: {
        items: [],
        loading: false,
        search: null,
        select: null,
      },
      items: { summary: null },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
