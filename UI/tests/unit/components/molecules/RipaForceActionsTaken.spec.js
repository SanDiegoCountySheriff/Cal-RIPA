import RipaForceActionsTaken from '@/components/molecules/RipaForceActionsTaken'
import Vuetify from 'vuetify'
import { defaultStop } from '@/utilities/stop.js'
import { mount, shallowMount } from '@vue/test-utils'

describe('Ripa Force Actions Taken', () => {
  let wrapper
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaForceActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const shallowFactory = propsData => {
    return shallowMount(RipaForceActionsTaken, {
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

  it('should validate force action rules', () => {
    wrapper = shallowFactory({ value: stop })

    expect(wrapper.vm.forceActionsTakenRules).toEqual([
      'At least one force-related action taken is required',
    ])

    wrapper.vm.viewModel.actionsTaken.anyForceActionsTaken = true
    wrapper.vm.viewModel.actionsTaken.forceActionsTakenDuringStop = [1]

    expect(wrapper.vm.forceActionsTakenRules).toEqual([true])
  })

  it.todo('should handle input')

  it.todo('should watch value')
})
