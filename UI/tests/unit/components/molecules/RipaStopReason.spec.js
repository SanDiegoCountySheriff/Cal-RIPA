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
  let stopV2

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
    stopV2 = V2_STOP
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

  it('should display old suspicion types for V1 stop', () => {
    stop.stopReason.reasonForStop = 2
    stop.stopReason.reasonableSuspicion = []
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
    expect(wrapper.html()).not.toContain(
      'Matched description of suspect’s vehicle or vehicle observed at the scene of a crime',
    )
    expect(wrapper.html()).not.toContain(
      'Other reasonable suspicion or probable cause that a crime has occurred',
    )
    expect(wrapper.html()).not.toContain(
      'Witness or victim identified stopped person as a suspect of a crime',
    )
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

  it('should display new suspicion types for V2 stop', () => {
    stopV2.stopReason.reasonForStop = 2
    stopV2.stopReason.reasonableSuspicion = []
    wrapper = mount(RipaStopReason, {
      vuetify,
      propsData: {
        value: stopV2,
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
    expect(wrapper.html()).toContain(
      'Matched description of suspect’s vehicle or vehicle observed at the scene of a crime',
    )
    expect(wrapper.html()).toContain(
      'Other reasonable suspicion or probable cause that a crime has occurred',
    )
    expect(wrapper.html()).toContain(
      'Witness or victim identified stopped person as a suspect of a crime',
    )
  })
})
