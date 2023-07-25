import RipaStopReason from '@/components/molecules/RipaStopReason.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'
import { computed } from 'vue'
import { V2_STOP } from '../../constants/RipaFormContainerTestConstants'

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

  it('stop type is vechiular show this question "Passenger in vehicle"', () => {
    const updatedStop = V2_STOP
    updatedStop.stopType = 'Vehicular'

    wrapper = mount(RipaStopReason, {
      vuetify,
      propsData: { value: V2_STOP },
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

    expect(wrapper.html()).toContain('passenger in a vehicle')
    expect(wrapper.html()).not.toContain('person in residence')
  })

  it('stop type is vechiular show this question "Person was inside a residence"', () => {
    const updatedStop = V2_STOP
    updatedStop.stopType = 'Pedestrian'

    wrapper = mount(RipaStopReason, {
      vuetify,
      propsData: { value: V2_STOP },
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

    expect(wrapper.html()).toContain('person was inside a residence')
    expect(wrapper.html()).not.toContain('passenger in a vehicle')
  })
})
