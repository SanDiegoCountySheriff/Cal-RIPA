import RipaForceActionsTaken from '@/components/molecules/RipaForceActionsTaken'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Force Actions Taken', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaForceActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        loadingPiiStep4: computed(() => false),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaForceActionsTaken, {
      vuetify,
      propsData: { value: stop },
      provide: {
        loadingPiiStep4() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
