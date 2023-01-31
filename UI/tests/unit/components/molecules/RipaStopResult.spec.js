import RipaStopResult from '@/components/molecules/RipaStopResult.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'
import { computed } from 'vue'

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
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display custom chip', async () => {
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
      },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop2 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop2 = true
    updatedStop.stopResult.warningCodes = [1]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should pull from reason code', async () => {
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
      },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop2 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeWarning()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should remove item when deleting chip', async () => {
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
      },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop2 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop2 = true
    updatedStop.stopResult.warningCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.removeItem('warningCodes', { item: { code: 1 } })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).not.toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
    expect(wrapper.html()).toContain('Statute Code 2')
    expect(wrapper.html()).not.toContain('Statute Code 2 - Statute Text 2')
  })
})
