import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import { mount } from '@vue/test-utils'
import { mapGetters } from 'vuex'
import Vuetify from 'vuetify'

describe('Ripa Form Container', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return mount(RipaFormContainer, {
      vuetify,
      mapGetters,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
