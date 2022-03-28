import RipaCpraReport from '@/components/molecules/RipaCpraReport.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa CPRA Report', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaCpraReport, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
