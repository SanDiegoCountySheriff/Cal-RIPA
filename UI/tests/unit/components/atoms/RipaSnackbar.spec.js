import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Snackbar', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaSnackbar, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaSnackbar, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', async () => {
    wrapper = factory()

    wrapper.vm.model = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should get timeout', async () => {
    wrapper = factory()

    expect(wrapper.vm.getTimeout).toEqual(6000)

    wrapper.setProps({ autoClose: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getTimeout).toEqual(null)
  })

  it('should handle view click', async () => {
    wrapper = factory()

    wrapper.vm.handleViewClick()

    expect(wrapper.emitted('on-view')).toBeTruthy()
    expect(wrapper.vm.model).toBeFalsy()
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
