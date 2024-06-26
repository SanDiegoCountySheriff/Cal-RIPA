import RipaCpraReportHistory from '@/components/molecules/RipaCpraReportHistory.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa CPRA Report History', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaCpraReportHistory, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaCpraReportHistory, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
