import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Statutes Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaStatutesGrid, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStatutesGrid, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
