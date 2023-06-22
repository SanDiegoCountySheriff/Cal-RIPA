import RipaStopReason from '@/components/molecules/RipaStopReason.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Stop Reason', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaStopReason, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopReason, {
      vuetify,
      propsData: {
        value: stop,
      },
      provide: {
        loadingPiiStep3: computed(() => false),
        isOnlineAndAuthenticated() {
          return true
        },
        lastReason() {
          return {}
        },
        personSearchAutomaticallySelected() {
          return false
        },
        propertySearchAutomaticallySelected() {
          return false
        },
        statutes: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
