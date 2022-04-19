import { shallowMount, mount } from '@vue/test-utils'
import RipaNumberInput from '@/components/atoms/RipaNumberInput.vue'
import Vuetify from 'vuetify'

describe('Ripa Number Input', () => {
  let wrapper = null
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const factory = propsData => {
    return shallowMount(RipaNumberInput, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const handleKeyPressTestCases = [
    {
      testNumber: 1,
      which: 20,
      preventDefaultCalled: 1,
    },
    {
      testNumber: 2,
      which: 50,
      preventDefaultCalled: 0,
    },
    {
      testNumber: 3,
      keyCode: 50,
      preventDefaultCalled: 0,
    },
    {
      testNumber: 4,
      keyCode: 20,
      preventDefaultCalled: 1,
    },
  ]

  it('should match snapshot', () => {
    wrapper = mount(RipaNumberInput, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  handleKeyPressTestCases.forEach(test => {
    it(`should handle key press test number: ${test.testNumber}`, () => {
      wrapper = factory()

      const event = {
        which: test.which,
        keyCode: test.keyCode,
        preventDefault: jest.fn(),
      }
      const preventDefault = jest.spyOn(event, 'preventDefault')

      wrapper.vm.handleKeyPress(event)

      expect(preventDefault).toHaveBeenCalledTimes(test.preventDefaultCalled)
    })
  })

  it('should handle blur', () => {
    wrapper = factory()
    const event = {
      target: {
        value: 'New Value',
      },
    }

    const handleInput = jest.spyOn(wrapper.vm, 'handleInput')
    wrapper.vm.handleBlur(event)

    expect(wrapper.vm.viewModel).toEqual('New Value')
    expect(handleInput).toHaveBeenCalledTimes(1)
  })

  it('should handle input', async () => {
    wrapper = factory()
    const newVal = 'New Value'

    wrapper.vm.handleInput(newVal)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should watch value', async () => {
    wrapper = factory()

    wrapper.vm.value = 'New Value'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual('New Value')
  })
})
