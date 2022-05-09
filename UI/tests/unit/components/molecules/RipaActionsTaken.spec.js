import RipaActionsTaken from '@/components/molecules/RipaActionsTaken'
import RipaModelMixin from '@/components/mixins/RipaModelMixin.vue'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Actions Taken', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaActionsTaken, { vuetify, propsData: { value: stop } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should validate explanation rules', () => {
    wrapper = factory({ value: stop })
    const nullTestCase = {
      testValue: null,
      firstTest: 'Explanation is required',
      secondTest: true,
      thirdTest: 'Min 5 characters',
    }
    const shortTestCase = {
      testValue: 'test',
      firstTest: true,
      secondTest: true,
      thirdTest: 'Min 5 characters',
    }
    const longTestCase = {
      testValue: '',
      firstTest: true,
      secondTest: 'Max 250 characters',
      thirdTest: true,
    }
    const validTestCase = {
      testValue: 'Testing',
      firstTest: true,
      secondTest: true,
      thirdTest: true,
    }

    for (let i = 0; i <= 255; i++) {
      longTestCase.testValue += 'a'
    }

    const testCases = [nullTestCase, shortTestCase, longTestCase, validTestCase]

    for (const testCase of testCases) {
      expect(wrapper.vm.explanationRules[0](testCase.testValue)).toEqual(
        testCase.firstTest,
      )
      expect(wrapper.vm.explanationRules[1](testCase.testValue)).toEqual(
        testCase.secondTest,
      )
      expect(wrapper.vm.explanationRules[2](testCase.testValue)).toEqual(
        testCase.thirdTest,
      )
    }
  })

  it('should handle pii check when created', () => {
    stop.actionsTaken.basisForSearchExplanation = 'Testing'
    wrapper = factory({ value: stop })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should validate actions taken rules', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.actionsTakenRules).toEqual([
      'At least one action taken is required',
    ])

    wrapper.vm.viewModel.actionsTaken.anyActionsTaken = true
    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [1]

    expect(wrapper.vm.actionsTakenRules).toEqual([true])
  })

  it('should validate basis for search rules', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.basisForSearchRules).toEqual([
      'At least one basis for search is required',
      true,
    ])

    wrapper.vm.viewModel.actionsTaken.personSearchConsentGiven = true
    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [10]
    wrapper.vm.viewModel.actionsTaken.basisForSearch = [2]

    expect(wrapper.vm.basisForSearchRules).toEqual([
      true,
      'Consent given must be selected if person or property consent was given.',
    ])

    wrapper.vm.viewModel.actionsTaken.personSearchConsentGiven = true
    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [10]
    wrapper.vm.viewModel.actionsTaken.basisForSearch = [1]

    expect(wrapper.vm.basisForSearchRules).toEqual([true, true])
  })

  it('should validate basis for property seizure rules', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.viewModel.actionsTaken.propertyWasSeized = true
    wrapper.vm.viewModel.actionsTaken.typeOfPropertySeized = []
    wrapper.vm.viewModel.actionsTaken.basisForPropertySeizure = []

    expect(wrapper.vm.basisForPropertySeizureRules).toEqual([
      'At least one basis for property seizure is required',
    ])

    wrapper.vm.viewModel.actionsTaken.basisForPropertySeizure = [1]

    expect(wrapper.vm.basisForPropertySeizureRules).toEqual([true])
  })

  it('should validate person property search consent given rules', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.personPropertySearchConsentGivenRules).toEqual([])

    wrapper.vm.viewModel.actionsTaken.basisForSearch = [1]

    expect(wrapper.vm.personPropertySearchConsentGivenRules).toEqual([
      '"Basis for Search" indicates "Consent Given" but Person search consent or Property search consent has not been selected',
    ])

    wrapper.vm.viewModel.actionsTaken.personSearchConsentGiven = true

    expect(wrapper.vm.personPropertySearchConsentGivenRules).toEqual([true])
  })

  it('should validate type of property seized rules', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.typeOfPropertySeizedRules).toEqual([
      'At least one type of property seized is required',
    ])

    wrapper.vm.viewModel.actionsTaken.propertyWasSeized = true
    wrapper.vm.viewModel.actionsTaken.typeOfPropertySeized = []
    wrapper.vm.viewModel.actionsTaken.basisForPropertySeizure = []

    expect(wrapper.vm.typeOfPropertySeizedRules).toEqual([
      'At least one type of property seized is required',
    ])

    wrapper.vm.viewModel.actionsTaken.typeOfPropertySeized = [1]

    expect(wrapper.vm.typeOfPropertySeizedRules).toEqual([true])
  })

  it('should get actions taken general items', () => {
    wrapper = factory({ value: stop })
    wrapper.vm.actionsTakenItems = [
      { value: 1 },
      { value: 2 },
      { value: 8 },
      { value: 10 },
      { value: 17 },
    ]

    wrapper.vm.viewModel.person.isStudent = true
    expect(wrapper.vm.getActionsTakenGeneralItems).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 17 },
    ])

    wrapper.vm.viewModel.person.isStudent = false

    expect(wrapper.vm.getActionsTakenGeneralItems).toEqual([
      { value: 1 },
      { value: 2 },
    ])
  })

  it('should get actions taken search items', () => {
    wrapper = factory({ value: stop })
    wrapper.vm.actionsTakenItems = [
      { value: 1 },
      { value: 2 },
      { value: 8 },
      { value: 10 },
      { value: 11 },
      { value: 12 },
      { value: 17 },
    ]

    expect(wrapper.vm.getActionsTakenSearchItems).toEqual([
      { value: 8, disabled: false },
      { value: 10, disabled: false },
      { value: 11, disabled: false },
      { value: 12, disabled: false },
    ])

    wrapper.vm.isAnyActionsTakenDisabled1 = true
    wrapper.vm.isAnyActionsTakenDisabled2 = true

    expect(wrapper.vm.getActionsTakenSearchItems).toEqual([
      { value: 8, disabled: false },
      { value: 10, disabled: true },
      { value: 11, disabled: false },
      { value: 12, disabled: true },
    ])
  })

  it('should get basis for search items', () => {
    wrapper = factory({ value: stop })
    wrapper.vm.basisForSearchItems = [
      { value: 1 },
      { value: 2 },
      { value: 12 },
      { value: 13 },
    ]

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = null

    expect(wrapper.vm.getBasisForSearchItems).toEqual([
      { value: 1 },
      { value: 2 },
    ])

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [12]
    wrapper.vm.viewModel.actionsTaken.basisForSearch = []

    expect(wrapper.vm.getBasisForSearchItems).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 12 },
    ])

    wrapper.vm.viewModel.person.isStudent = true

    expect(wrapper.vm.getBasisForSearchItems).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 12 },
      { value: 13 },
    ])
  })

  it('should get basis for property seizure items', () => {
    wrapper = factory({ value: stop })
    wrapper.vm.basisForPropertySeizureItems = [
      { value: 1 },
      { value: 2 },
      { value: 6 },
    ]

    expect(wrapper.vm.getBasisForPropertySeizureItems).toEqual([
      { value: 1 },
      { value: 2 },
    ])

    wrapper.vm.viewModel.person.isStudent = true

    expect(wrapper.vm.getBasisForPropertySeizureItems).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 6 },
    ])
  })

  it('should validate was search of person or property conducted', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = null

    expect(wrapper.vm.wasSearchOfPersonOrPropertyConducted).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [10]
    wrapper.vm.viewModel.actionsTaken.basisForSearch = []

    expect(wrapper.vm.wasSearchOfPersonOrPropertyConducted).toBeTruthy()
  })

  it('should validate was asked for consent', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.wasAskedForConsent).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.personSearchConsentGiven = true

    expect(wrapper.vm.wasAskedForConsent).toBeTruthy()
  })

  it('should validate was asked for consent to search person', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.wasAskedForConsentToSearchPerson).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [8]

    expect(wrapper.vm.wasAskedForConsentToSearchPerson).toBeTruthy()
  })

  it('should validate was asked for consent to search property', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.wasAskedForConsentToSearchProperty).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [11]

    expect(wrapper.vm.wasAskedForConsentToSearchProperty).toBeTruthy()
  })

  it('should display basis for search explanation when valid', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.viewModel.actionsTaken.basisForSearch = []

    expect(wrapper.vm.isBasisForSearchExplanationVisible).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.basisForSearch = [4]

    expect(wrapper.vm.isBasisForSearchExplanationVisible).toBeFalsy()

    wrapper.vm.viewModel.actionsTaken.basisForSearch = [3]
    wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop = [10]

    expect(wrapper.vm.isBasisForSearchExplanationVisible).toBeTruthy()
  })

  it('should handle input', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should handle check pii', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.handlePiiCheck('test')

    expect(wrapper.emitted('pii-check')).toBeTruthy()
    expect(wrapper.emitted('pii-check')[0][0].value).toEqual('test')
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
