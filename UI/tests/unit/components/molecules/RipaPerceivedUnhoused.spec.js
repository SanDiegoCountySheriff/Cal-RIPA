import RipaPerceivedUnhoused from '@/components/molecules/RipaPerceivedUnhoused.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Perceived Unhoused', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaPerceivedUnhoused, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaPerceivedUnhoused, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.model = { test: 'test' }

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual([{ test: 'test' }])
  })

  it('should watch model', async () => {
    stop.person.perceivedUnhoused = false
    wrapper = factory({ value: stop })

    wrapper.vm.model.person.perceivedUnhoused = true

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
  })
})
