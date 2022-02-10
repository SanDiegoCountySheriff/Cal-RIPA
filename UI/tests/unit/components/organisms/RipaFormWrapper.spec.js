import RipaFormWrapper from '@/components/organisms/RipaFormWrapper.vue'
import RipaFormStep3 from '@/components/molecules/RipaFormStep3.vue'
import RipaStopReason from '@/components/molecules/RipaStopReason.vue'
import RipaSelect from '@/components/atoms/RipaSelect.vue'
import { createLocalVue, createWrapper, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'

describe('Ripa Form Wrapper', () => {
  const localVue = createLocalVue()
  let wrapper
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return mount(RipaFormWrapper, {
      localVue,
      vuetify,
      propsData: {
        value: stop,
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should reset reasonableSuspicion when changing reasonForStop', async () => {
    wrapper = factory({ formStepIndex: 3 })
    const expected = []

    const nextButton = wrapper
      .findAll('.v-btn')
      .filter(btn => btn.text() === 'Next')
      .at(0)

    const backButton = wrapper
      .findAll('.v-btn')
      .filter(btn => btn.text() === 'Back')
      .at(0)

    const selector = wrapper.find('.v-select').props().items[1]
    const reasonSelector = mount(wrapper.findComponent(RipaSelect))
    reasonSelector.vm.selectItem(selector)
    await wrapper.vm.$nextTick()
    // wrapper.findAll('.v-select__slot').at(0).trigger('click')
    // await wrapper.vm.$nextTick()

    // wrapper.findAll('.v-list-item').at(1).trigger('click')
    // await wrapper.vm.$nextTick()

    expect(wrapper.vm.stop.stopReason.reasonableSuspicion).toEqual(expected)
  })
})
