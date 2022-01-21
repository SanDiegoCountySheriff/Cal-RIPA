import RipaAgencyQuestions from '@/components/molecules/RipaAgencyQuestions'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount } from '@vue/test-utils'
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
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should calculate is required', () => {
    wrapper = factory({ value: stop })
    expect(wrapper.vm.isRequired).toBeFalsy()
    wrapper.vm.viewModel.agencyQuestions[0] = {
      name: 'FavoriteColor',
      required: true,
    }

    console.log(wrapper.vm.viewModel.agencyQuestions)
    expect(wrapper.vm.isRequired).toBeTruthy()
  })

  it.todo('should handle input')

  it.todo('should validate question rules')

  it.todo('should watch value')
})
