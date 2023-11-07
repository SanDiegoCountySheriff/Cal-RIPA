import RipaAge from '@/components/molecules/RipaAge'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
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
    wrapper = mount(RipaAge, { vuetify, propsData: { value: stop } })

    expect(wrapper.html()).toMatchSnapshot()
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

  it('should watch model', async () => {
    wrapper = factory({ value: stop })

    wrapper.vm.model.person.perceivedAge = 33

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
  })
})
