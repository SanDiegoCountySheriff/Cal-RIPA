import RipaEditStopExplanation from '@/components/molecules/RipaEditStopExplanation.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Edit Stop Explanation', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaEditStopExplanation, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaEditStopExplanation, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
