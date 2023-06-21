import RipaSwitch from '@/components/atoms/RipaSwitch'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Switch', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaSwitch, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaSwitch, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', async () => {
    wrapper = factory()

    wrapper.vm.model = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
  })
})
