import RipaStopResult from '@/components/molecules/RipaStopResult.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'
import { computed } from 'vue'
import { V2_STOP } from '../../constants/RipaFormContainerTestConstants'

describe('Ripa Stop Result', () => {
  let vuetify
  let wrapper
  let stop
  const statutes = [
    {
      code: 1,
      fullName: 'Statute Code 1 - Statute Text 1',
    },
    {
      code: 2,
      fullName: 'Statute Code 2 - Statute Text 2',
    },
  ]

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaStopResult, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: {
        value: stop,
      },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display custom chip', async () => {
    stop.stopResult.resultsOfStop2 = true
    stop.stopResult.warningCodes = [1]

    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should pull from reason code', async () => {
    stop.stopReason.trafficViolationCode = 1
    stop.stopResult.resultsOfStop2 = true

    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    wrapper.vm.handlePullReasonCodeWarning()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should remove item when deleting chip', async () => {
    stop.stopResult.resultsOfStop2 = true
    stop.stopResult.warningCodes = [1, 2]

    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    wrapper.vm.removeItem('warningCodes', { item: { code: 1 } })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).not.toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
    expect(wrapper.html()).toContain('Statute Code 2')
    expect(wrapper.html()).not.toContain('Statute Code 2 - Statute Text 2')
  })

  it('should display verbal and written warning for v2 stop', () => {
    const v2stop = V2_STOP
    v2stop.stopResult.anyResultsOfStop = true
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: v2stop },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    expect(wrapper.html()).toContain('Verbal Warning')
    expect(wrapper.html()).toContain('Written Warning')
  })

  it('should not display verbal and written warning for legacy stop', () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => statutes),
        favoriteResults: computed(() => []),
      },
    })

    expect(wrapper.html()).not.toContain('Verbal Warning')
    expect(wrapper.html()).not.toContain('Written Warning')
  })
})
