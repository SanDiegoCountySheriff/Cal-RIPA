import RipaSubmission from '@/components/molecules/RipaSubmission.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Submission', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaSubmission, {
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
