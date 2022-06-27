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

  it('should have a true isPullReasonCodeWrittenWarningDisabled()', async () => {
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
    updatedStop.stopResult.writtenWarningCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeWrittenWarningDisabled).toBe(true)
    expect(
      updatedStop.stopResult.writtenWarningCodes.length,
    ).toBeGreaterThanOrEqual(5)
  })

  it('should have a false isPullReasonCodeWrittenWarningDisabled()', async () => {
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

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeWrittenWarningDisabled).toBe(false)
    expect(updatedStop.stopResult.writtenWarningCodes.length).toBeLessThan(5)
  })

  it('should have a true isPullReasonCodeWarningDisabled()', async () => {
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
    updatedStop.stopResult.warningCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeWarningDisabled).toBe(true)
    expect(updatedStop.stopResult.warningCodes.length).toBeGreaterThanOrEqual(5)
  })

  it('should have a false isPullReasonCodeWarningDisabled()', async () => {
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

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeWarningDisabled).toBe(false)
    expect(updatedStop.stopResult.warningCodes.length).toBeLessThan(5)
  })

  it('should have a true isPullReasonCodeCitationDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop3 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop3 = true
    updatedStop.stopResult.citationCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeCitationDisabled).toBe(true)
    expect(updatedStop.stopResult.citationCodes.length).toBeGreaterThanOrEqual(
      5,
    )
  })

  it('should have a false isPullReasonCodeCitationDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop3 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop3 = true
    updatedStop.stopResult.citationCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeCitationDisabled).toBe(false)
    expect(updatedStop.stopResult.citationCodes.length).toBeLessThan(5)
  })

  it('should have a true isPullReasonCodeInfieldDisable()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop4 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop4 = true
    updatedStop.stopResult.infieldCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeInfieldDisable).toBe(true)
    expect(updatedStop.stopResult.infieldCodes.length).toBeGreaterThanOrEqual(5)
  })

  it('should have a false isPullReasonCodeInfieldDisable()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop4 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop4 = true
    updatedStop.stopResult.infieldCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeInfieldDisable).toBe(false)
    expect(updatedStop.stopResult.infieldCodes.length).toBeLessThan(5)
  })

  it('should have a true isPullReasonCodeCustodialArrestDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    updatedStop.stopResult.custodialArrestCodes = [1, 2, 3, 4, 5]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeCustodialArrestDisabled).toBe(true)
    expect(
      updatedStop.stopResult.custodialArrestCodes.length,
    ).toBeGreaterThanOrEqual(5)
  })

  it('should have a false isPullReasonCodeCustodialArrestDisabled()', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    updatedStop.stopResult.custodialArrestCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPullReasonCodeCustodialArrestDisabled).toBe(false)
    expect(updatedStop.stopResult.custodialArrestCodes.length).toBeLessThan(5)
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

  it('should return true if homeland security is selected', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop10 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop10 = true
    updatedStop.stopResult.custodialArrestCodes = [1, 2]
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.isHomelandSecuritySelected).toBe(true)
  })

  it('should return true if reasonable suspicion is selected', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    let updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    updatedStop = defaultStop()
    updatedStop.stopResult.resultsOfStop6 = true
    updatedStop.stopResult.custodialArrestCodes = [1, 2]
    updatedStop.stopReason.reasonableSuspicionCode = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()
    let reasonableSuspicion = null

    if (updatedStop.stopReason.reasonableSuspicionCode) {
      reasonableSuspicion = true
    }

    // wrapper.vm.removeItem('verbalWarningCodes', { item: { code: 1 } })

    // await wrapper.vm.$nextTick()

    // expect(wrapper.vm.isReasonableSuspicionCode).toBe(true)
    expect(reasonableSuspicion).toBe(true)
  })

  it('should return false for handlePullReasonCodeVerbalWarning', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop1 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeVerbalWarning()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Statute Code 1')
    expect(wrapper.html()).not.toContain('Statute Code 1 - Statute Text 1')
    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })

  it('should return false for handlePullReasonCodeWrittenWarning', async () => {
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
    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })

  it('should return false for handlePullReasonCodeWarning', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop2 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeWarning()

    await wrapper.vm.$nextTick()

    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })

  it('should return false for handlePullReasonCodeCitation', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop3 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeCitation()

    await wrapper.vm.$nextTick()

    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })

  it('should return false for handlePullReasonCodeInfield', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop4 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeInfield()

    await wrapper.vm.$nextTick()

    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })

  it('should return false for handlePullReasonCodeCustodialArrest', async () => {
    wrapper = mount(RipaStopResult, {
      vuetify,
      propsData: { value: stop, statutes: statutes },
    })

    const updatedStop = defaultStop()
    updatedStop.stopReason.trafficViolationCode = 1
    updatedStop.stopResult.resultsOfStop6 = true
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePullReasonCodeCustodialArrest()

    await wrapper.vm.$nextTick()

    expect(updatedStop.stopResult.pullFromReasonCode).toBe(false)
  })
})
