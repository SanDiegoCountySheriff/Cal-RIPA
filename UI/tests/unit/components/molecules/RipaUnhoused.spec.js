import RipaUnhoused from '@/components/molecules/RipaUnhoused'
import Vuetify from 'vuetify'
import { defaultStop } from '@/utilities/stop'
import { mount, shallowMount } from '@vue/test-utils'

describe('Ripa Unhoused', () => {
  let wrapper
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaUnhoused, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const shallowFactory = propsData => {
    return shallowMount(RipaUnhoused, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should handle input', () => {
    wrapper = shallowFactory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should watch value', () => {
    wrapper = shallowFactory({ value: stop })

    const updatedStop = defaultStop()
    updatedStop.id = 1

    wrapper.setProps({ value: updatedStop })

    expect(wrapper.vm.viewModel.id).toEqual(1)
  })
})
