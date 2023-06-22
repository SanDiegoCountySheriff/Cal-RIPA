import RipaTextInput from '@/components/atoms/RipaTextInput'
import { shallowMount, mount } from '@vue/test-utils'
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

  afterEach(() => {
    wrapper.destroy()
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
    },
    {
      testNumber: 2,
      numbersOnly: true,
      keyCode: 20,
      preventDefaultCalledTimes: 1,
    },
    {
      testNumber: 3,
      numbersOnly: true,
      which: 50,
      preventDefaultCalledTimes: 0,
    },
    {
      testNumber: 4,
      numbersOnly: false,
      which: 20,
      preventDefaultCalledTimes: 0,
    },
  ]

  it('should match snapshot', () => {
    wrapper = mount(RipaTextInput, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', () => {
    wrapper = factory()

    wrapper.vm.model = { test: 'test' }

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual([{ test: 'test' }])
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

  keyPressTestCases.forEach(test => {
    it(`should handle key press test number: ${test.testNumber}`, async () => {
      wrapper = factory()
      const event = {
        which: test.which,
        keyCode: test.keyCode,
        preventDefault: jest.fn(),
      }
      const preventDefault = jest.spyOn(event, 'preventDefault')
      wrapper.setProps({ numbersOnly: test.numbersOnly })
      await wrapper.vm.$nextTick()

      wrapper.vm.handleKeyPress(event)

      expect(preventDefault).toHaveBeenCalledTimes(
        test.preventDefaultCalledTimes,
      )
    })
  })

  it('should handle blur', () => {
    wrapper = factory()
    const event = {
      target: {
        value: 'New Value',
      },
    }
    const parseText = jest.spyOn(wrapper.vm, 'parseText')

    wrapper.vm.handleBlur(event)

    expect(parseText).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('blur')[0]).toEqual(['New Value'])
  })

  it('should parse text', () => {
    wrapper = factory()

    let actualValue = wrapper.vm.parseText(false)

    expect(actualValue).toEqual('')

    actualValue = wrapper.vm.parseText('Text')

    expect(actualValue).toEqual('Text')
  })
})
