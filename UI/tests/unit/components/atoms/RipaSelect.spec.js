import RipaSelect from '@/components/atoms/RipaSelect'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Select', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaSelect, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaSelect, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', async () => {
    wrapper = factory()

    wrapper.vm.model = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
