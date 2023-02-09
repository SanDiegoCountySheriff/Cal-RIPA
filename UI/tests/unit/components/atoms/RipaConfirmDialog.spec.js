import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Confirm Dialog', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaConfirmDialog, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const testData = {
    title: 'Title',
    subtitle: 'Subtitle',
    showDialog: true,
  }

  it('should match snapshot', async () => {
    wrapper = mount(RipaConfirmDialog, { vuetify, propsData: { ...testData } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should handle cancel', () => {
    wrapper = factory(testData)

    wrapper.vm.handleCancel()

    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('should handle confirm', () => {
    wrapper = factory(testData)

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('should watch showDialog', async () => {
    wrapper = factory(testData)

    wrapper.setProps({ showDialog: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDialog).toBeFalsy()

    wrapper.setProps({ showDialog: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDialog).toBeFalsy()

    wrapper.setProps({ showDialog: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDialog).toBeTruthy()
    expect(wrapper.vm.isConfirmDisabled).toBeFalsy()
  })
})
