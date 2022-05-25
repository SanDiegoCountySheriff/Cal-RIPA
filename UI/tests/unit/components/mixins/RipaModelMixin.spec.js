import MockModelComponent from '../../mock/MockModelComponent'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { defaultStop } from '@/utilities/stop.js'
import { V2_STOP } from '../../constants/RipaFormContainerTestConstants'

const localVue = createLocalVue()
localVue.use(Vuex)

const searchModelTests = [
  {
    nonForceActionsTakenDuringStop: [],
    expectedSetPersonSearchCalledTimes: 0,
    expectedSetPropertySearchCalledTimes: 0,
    stopReason: {},
    searchOfPerson: false,
    expectedIsAnyActionsTakenDisabled1: false,
    expectedAnyActionsTaken: true,
    searchOfProperty: false,
    expectedIsAnyActionsTakenDisabled2: false,
    expectedNonForceActionsTakenDuringStop: [],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: null,
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
  {
    nonForceActionsTakenDuringStop: [10, 12],
    expectedSetPersonSearchCalledTimes: 1,
    expectedSetPropertySearchCalledTimes: 1,
    stopReason: {},
    searchOfPerson: false,
    expectedIsAnyActionsTakenDisabled1: false,
    expectedAnyActionsTaken: true,
    searchOfProperty: false,
    expectedIsAnyActionsTakenDisabled2: false,
    expectedNonForceActionsTakenDuringStop: [10, 12],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: [],
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
  {
    nonForceActionsTakenDuringStop: [],
    expectedSetPersonSearchCalledTimes: 1,
    expectedSetPropertySearchCalledTimes: 0,
    stopReason: {},
    searchOfPerson: true,
    expectedIsAnyActionsTakenDisabled1: true,
    expectedAnyActionsTaken: true,
    searchOfProperty: false,
    expectedIsAnyActionsTakenDisabled2: false,
    expectedNonForceActionsTakenDuringStop: [10],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: [],
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
  {
    nonForceActionsTakenDuringStop: [10],
    expectedSetPersonSearchCalledTimes: 0,
    expectedSetPropertySearchCalledTimes: 0,
    stopReason: {},
    searchOfPerson: true,
    expectedIsAnyActionsTakenDisabled1: true,
    expectedAnyActionsTaken: true,
    searchOfProperty: false,
    expectedIsAnyActionsTakenDisabled2: false,
    expectedNonForceActionsTakenDuringStop: [10],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: [],
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
  {
    nonForceActionsTakenDuringStop: [],
    expectedSetPersonSearchCalledTimes: 0,
    expectedSetPropertySearchCalledTimes: 1,
    stopReason: {},
    searchOfPerson: false,
    expectedIsAnyActionsTakenDisabled1: false,
    expectedAnyActionsTaken: true,
    searchOfProperty: true,
    expectedIsAnyActionsTakenDisabled2: true,
    expectedNonForceActionsTakenDuringStop: [12],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: [],
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
  {
    nonForceActionsTakenDuringStop: [12],
    expectedSetPersonSearchCalledTimes: 0,
    expectedSetPropertySearchCalledTimes: 0,
    stopReason: {},
    searchOfPerson: false,
    expectedIsAnyActionsTakenDisabled1: false,
    expectedAnyActionsTaken: true,
    searchOfProperty: true,
    expectedIsAnyActionsTakenDisabled2: true,
    expectedNonForceActionsTakenDuringStop: [12],
    expectedPersonSearchConsentGiven: false,
    expectedPropertySearchConsentGiven: false,
    expectedBasisForSearch: [],
    expectedBasisForSearchExplanation: null,
    expectedBasisForSearchPiiFound: false,
  },
]

describe('Ripa Model Mixin', () => {
  let wrapper
  let stop
  let store
  let actions

  beforeEach(() => {
    stop = defaultStop()
    actions = {
      setPersonSearchAutomaticallySelected: jest.fn(),
      setPropertySearchAutomaticallySelected: jest.fn(),
    }
    store = new Vuex.Store({ actions })
  })

  const factory = propsData => {
    return shallowMount(MockModelComponent, {
      localVue,
      store,
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  it('should sync model for non-force actions taken', () => {
    wrapper = factory({ value: stop })
    const updatedStop = V2_STOP
    updatedStop.actionsTaken.nonForceActionsTakenDuringStop = [1]

    const actual = wrapper.vm.syncModel(updatedStop)

    expect(actual.actionsTaken.nonForceActionsTakenDuringStop).toEqual([1])
    expect(actual.actionsTaken.actionsTakenDuringStop).toEqual(undefined)
  })

  it('should update non force actions taken model', () => {
    stop.actionsTaken.nonForceActionsTakenDuringStop = [16, 17]
    stop.actionsTaken.anyActionsTaken = true
    wrapper = factory({ value: stop })

    wrapper.vm.updateNonForceActionsTakenModel()

    expect(
      wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual([16])
  })

  it('should update non force actions taken model for student', () => {
    stop.actionsTaken.nonForceActionsTakenDuringStop = [16, 17]
    stop.actionsTaken.anyActionsTaken = true
    stop.person.isStudent = true
    wrapper = factory({ value: stop })

    wrapper.vm.updateNonForceActionsTakenModel()

    expect(
      wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual([16, 17])
  })

  it.each(searchModelTests)(
    'should update non force actions taken search model',
    searchModelTests => {
      stop = defaultStop()
      stop.actionsTaken.nonForceActionsTakenDuringStop =
        searchModelTests.nonForceActionsTakenDuringStop
      stop.stopReason = searchModelTests.stopReason
      stop.stopReason.searchOfPerson = searchModelTests.searchOfPerson
      stop.stopReason.searchOfProperty = searchModelTests.searchOfProperty
      wrapper = factory({ value: stop })
      const setPersonSearchAutomaticallySelected = jest.spyOn(
        wrapper.vm,
        'setPersonSearchAutomaticallySelected',
      )
      const setPropertySearchAutomaticallySelected = jest.spyOn(
        wrapper.vm,
        'setPropertySearchAutomaticallySelected',
      )

      wrapper.vm.updateNonForceActionsTakenSearchModel()

      expect(setPersonSearchAutomaticallySelected).toHaveBeenCalledTimes(
        searchModelTests.expectedSetPersonSearchCalledTimes,
      )
      expect(setPropertySearchAutomaticallySelected).toHaveBeenCalledTimes(
        searchModelTests.expectedSetPropertySearchCalledTimes,
      )
      expect(wrapper.vm.isAnyActionsTakenDisabled1).toEqual(
        searchModelTests.expectedIsAnyActionsTakenDisabled1,
      )
      expect(wrapper.vm.viewModel.actionsTaken.anyActionsTaken).toEqual(
        searchModelTests.expectedAnyActionsTaken,
      )
      expect(wrapper.vm.isAnyActionsTakenDisabled2).toEqual(
        searchModelTests.expectedIsAnyActionsTakenDisabled2,
      )
      expect(
        wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop,
      ).toEqual(searchModelTests.expectedNonForceActionsTakenDuringStop)
      expect(
        wrapper.vm.viewModel.actionsTaken.personSearchConsentGiven,
      ).toEqual(searchModelTests.expectedPersonSearchConsentGiven)
      expect(
        wrapper.vm.viewModel.actionsTaken.propertySearchConsentGiven,
      ).toEqual(searchModelTests.expectedPropertySearchConsentGiven)
      expect(wrapper.vm.viewModel.actionsTaken.basisForSearch).toEqual(
        searchModelTests.expectedBasisForSearch,
      )
      expect(
        wrapper.vm.viewModel.actionsTaken.basisForSearchExplanation,
      ).toEqual(searchModelTests.expectedBasisForSearchExplanation)
      expect(wrapper.vm.viewModel.actionsTaken.basisForSearchPiiFound).toEqual(
        searchModelTests.expectedBasisForSearchPiiFound,
      )
    },
  )
})
