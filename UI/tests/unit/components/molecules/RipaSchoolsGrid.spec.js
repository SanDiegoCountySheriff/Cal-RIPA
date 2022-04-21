import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Schools Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaSchoolsGrid, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaSchoolsGrid, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
