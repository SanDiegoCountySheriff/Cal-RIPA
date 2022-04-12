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
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  }

  it('should match snapshot', async () => {
    wrapper = mount(RipaConfirmDialog, { vuetify, propsData: { ...testData } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should handle cancel', () => {
    wrapper = factory(testData)
    const onClose = jest.spyOn(wrapper.vm, 'onClose')

    wrapper.vm.handleCancel()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should handle confirm', () => {
    wrapper = factory(testData)
    const onConfirm = jest.spyOn(wrapper.vm, 'onConfirm')

    wrapper.vm.handleConfirm()

    expect(onConfirm).toHaveBeenCalledTimes(1)
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
