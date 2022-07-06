import RipaGender from '@/components/molecules/RipaGender.vue'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Gender', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const shallowFactory = propsData => {
    return shallowMount(RipaGender, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const factory = propsData => {
    return mount(RipaGender, {
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

  it('should contain nonbinary person', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toContain('Nonbinary person')
    expect(wrapper.html()).not.toContain('Gender nonconforming')
  })

  it('should not allow gender selection with nonbinary', async () => {
    wrapper = factory({ value: stop })
    const radioGroup = wrapper.findComponent(RipaRadioGroup)
    radioGroup.vm.model = 1
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel.person.perceivedGender).toEqual(1)

    radioGroup.vm.model = 9
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel.person.perceivedGender).toEqual(9)
    expect(wrapper.vm.viewModel.person.perceivedGender).not.toEqual(1)
  })

  it('should contain cisgender man/boy', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toContain('Cisgender man/boy')
    expect(wrapper.html()).not.toContain('Male')
  })

  it('should contain cisgender woman/girl', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toContain('Cisgender woman/girl')
    expect(wrapper.html()).not.toContain('Female')
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
