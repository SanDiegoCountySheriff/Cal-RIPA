import RipaTextInput from '@/components/atoms/RipaTextInput'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Text Input', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaTextInput, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const keyPressTestCases = [
      {
          testNumber: 1,
          numbersOnly: true,
          which: 20,
          preventDefaultCalledTimes: 1,
      }
  ]

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should handle drop', () => {
    wrapper = factory()
    const event = {
      preventDefault: jest.fn(),
    }
    const preventDefault = jest.spyOn(event, 'preventDefault')

    wrapper.vm.handleDrop(event)

    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should handle key press', () => {
    wrapper = factory()
    const event = {
        which: 20
    }
  })

  it.todo('should handle blur')

  it.todo('should parse text')

  it.todo('should handle input')

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
