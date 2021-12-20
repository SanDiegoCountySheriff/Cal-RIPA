import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog.vue'
import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Confirm Dialog', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return mount(RipaConfirmDialog, {
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
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display titles correctly', async () => {
    wrapper = factory(testData)

    expect(wrapper.html()).toContain('Title')
    expect(wrapper.html()).toContain('Subtitle')
  })

  it('should call this.onClose()', () => {
    wrapper = factory(testData)

    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(0)

    wrapper.findAll('button').at(0).trigger('click')

    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call this.onConfirm()', () => {
    wrapper = factory(testData)

    expect(wrapper.vm.onConfirm).toHaveBeenCalledTimes(0)

    wrapper.findAll('button').at(1).trigger('click')

    expect(wrapper.vm.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should watch showDialog', async () => {
    wrapper = factory()

    wrapper.setProps({ showDialog: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDialog).toEqual(true)
  })
})
