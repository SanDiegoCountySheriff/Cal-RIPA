import RipaNonForceActionsTaken from '@/components/molecules/RipaNonForceActionsTaken'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Non Force Actions Taken', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaNonForceActionsTaken, {
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
    wrapper = mount(RipaNonForceActionsTaken, {
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

  it.todo('should only display three consent boxes if consent was given')
})
