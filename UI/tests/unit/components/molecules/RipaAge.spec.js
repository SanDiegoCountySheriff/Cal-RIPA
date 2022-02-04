import RipaAge from '@/components/molecules/RipaAge'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Age', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaAge, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should validate age rules', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.ageRules[0](0)).toEqual('An age is required')
    expect(wrapper.vm.ageRules[1](0)).toEqual(
      'Age must be between 1 and 120 years',
    )
    expect(wrapper.vm.ageRules[0](30)).toEqual(true)
    expect(wrapper.vm.ageRules[1](30)).toEqual(true)
  })

  it('should handle input', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should watch value', async () => {
    wrapper = factory({ value: stop })

    const updatedStop = defaultStop()
    updatedStop.id = 1

    wrapper.setProps({ value: updatedStop })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel.id).toEqual(1)
  })
})
