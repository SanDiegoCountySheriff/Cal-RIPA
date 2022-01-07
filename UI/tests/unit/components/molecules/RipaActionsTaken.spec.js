import RipaActionsTaken from '@/components/molecules/RipaActionsTaken'
import RipaModelMixin from '@/components/mixins/RipaModelMixin.vue'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Actions Taken', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
