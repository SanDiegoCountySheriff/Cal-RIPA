import RipaAgencyQuestions from '@/components/molecules/RipaAgencyQuestions'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Agency Questions', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaAgencyQuestions, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaAgencyQuestions, {
      vuetify,
      propsData: { value: stop },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should calculate is required', () => {
    wrapper = factory({ value: stop })
    expect(wrapper.vm.isRequired).toBeFalsy()

    wrapper.vm.viewModel.agencyQuestions.push({
      name: 'FavoriteColor',
      required: true,
    })

    expect(wrapper.vm.isRequired).toBeTruthy()
  })

  it('should handle input', async () => {
    wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should validate question rules', () => {
    wrapper = factory({ value: stop })
    const question = {
      maxLength: 5,
    }

    expect(wrapper.vm.questionRules(question)[0]('')).toEqual(
      'An answer is required',
    )
    expect(wrapper.vm.questionRules(question)[1]('')).toEqual(true)
    expect(wrapper.vm.questionRules(question)[0]('Testing')).toEqual(true)
    expect(wrapper.vm.questionRules(question)[1]('Testing')).toEqual(
      'Max 5 characters',
    )
  })
})
