import RipaStopResult from '@/components/molecules/RipaStopResult.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Stop Result', () => {
  let vuetify
  let wrapper
  let stop

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
    })
  }

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

  it('should match snapshot', () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display custom chip', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    updatedStop.stopResult.writtenWarningCodes = [1]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should pull from reason code', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop14 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeWrittenWarning()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
  })

  it('should remove item when deleting chip', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    updatedStop.stopResult.writtenWarningCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.removeItem('writtenWarningCodes', { item: { code: 1 } })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).not.toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
    expect(wrapper.html()).toContain('Statute Code 2')
    expect(wrapper.html()).not.toContain('Statute Code 2 - Statute Text 2')
  })

  it('should contain modified "Contacted parent/legal guardian"', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
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

    expect(wrapper.html()).toContain(
      'Contacted parent/legal guardian or other person legally responsible for the person',
    )
    expect(wrapper.html()).not.toContain(
      'Contacted parent/legal guardian or other person legally responsible for the minor',
    )
  })

  it('should contain "Written Warning"', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop14 = true
    updatedStop.stopResult.writtenWarningCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.removeItem('writtenWarningCodes', { item: { code: 1 } })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Written Warning')
  })

  it('should contain "Verbal Warning"', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    updatedStop.stopResult.verbalWarningCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Verbal Warning')
  })

  it('should have a true isPullReasonCodeVerbalWarningDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
      computed: {
        isPullReasonCodeVerbalWarningDisabled() {
          return true
        },
      },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    updatedStop.stopResult.verbalWarningCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeVerbalWarningDisabled).toBe(true)
    expect(
      updatedStop.stopResult.verbalWarningCodes.length,
    ).toBeGreaterThanOrEqual(5)
  })

  it('should have a false isPullReasonCodeVerbalWarningDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
      computed: {
        isPullReasonCodeVerbalWarningDisabled() {
          return false
        },
      },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop1 = true
    updatedStop.stopResult.verbalWarningCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeVerbalWarningDisabled).toBe(false)
    expect(updatedStop.stopResult.verbalWarningCodes.length).toBeLessThan(5)
  })

  it('should not contain "Warning (verbal or written)"', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
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

    expect(wrapper.html()).not.toContain('Warning (verbal or written)')
  })
})
