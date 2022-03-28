import RipaLimitedEnglish from '@/components/molecules/RipaLimitedEnglish.vue'
import { shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Limited English', () => {
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
    return shallowMount(RipaLimitedEnglish, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.element).toMatchSnapshot()
  })
})
