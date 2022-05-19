import RipaStopType from '@/components/molecules/RipaStopType'
import { mount, shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'

describe('Ripa Stop Type', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaStopType, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const shallowFactory = propsData => {
    return shallowMount(RipaStopType, {
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

  it('should validate stop type rules', () => {
    wrapper = shallowFactory({ value: stop })

    expect(wrapper.vm.stopTypeRules[0]('')).toEqual('A stop type is required')
    expect(wrapper.vm.stopTypeRules[0]('Stop Type')).toEqual(true)
  })

  it('should handle input', () => {
    wrapper = shallowFactory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should watch value', async () => {
    wrapper = shallowFactory({ value: stop })

    const updatedStop = defaultStop()
    updatedStop.id = 1

    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel.id).toEqual(1)
  })
})
