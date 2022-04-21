import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'

describe('Ripa Radio Group', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaRadioGroup, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaRadioGroup, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', async () => {
    wrapper = factory()
    wrapper.vm.model = 'New Value'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should handle clear selection', () => {
    wrapper = factory()
    wrapper.vm.handleClearSelection()

    expect(wrapper.vm.model).toEqual(null)
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
