import RipaStopReason from '@/components/molecules/RipaStopReason.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

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
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should validate probable cause rules', async () => {
    stop.stopReason.reasonForStop = 3
    stop.stopReason.probableCause = [1]
    wrapper = factory({ value: stop })

    expect(wrapper.vm.probableCauseRules).toEqual([true])

    const updatedStop = defaultStop()
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.probableCauseRules).toEqual([
      'A probable cause type is required',
    ])
  })

  it('should validate probable cause code rules', async () => {
    stop.stopReason.reasonForStop = 3
    stop.stopReason.probableCauseCode = 'Test Code'
    wrapper = factory({ value: stop })

    expect(wrapper.vm.probableCauseCodeRules).toEqual([true])

    const updatedStop = defaultStop()
    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.probableCauseCodeRules).toEqual([
      'An offense code is required',
    ])
  })
})
