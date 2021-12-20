import { mount } from '@vue/test-utils'
import RipaLocation from '@/components/molecules/RipaLocation.vue'
import RipaModelMixin from '@/components/mixins/RipaModelMixin.vue'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'

describe('Ripa Location', () => {
  let vuetify
  let stop

  const schoolsList = JSON.parse('[{"cdsCode":"1","fullName":"High School"}]')
  const countyCitiesList = JSON.parse('[{"id":"1","fullName":"CountyCity"}]')
  const nonCountyCitiesList = JSON.parse(
    '[{"id":"2","fullName":"NonCountyCity"}]',
  )
  const beatsList = JSON.parse('[{"id":"1","fullName":"Beat 1"}]')

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaLocation, {
      vuetify,
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  const schoolTestCases = [
    {
      school: null,
      expected: ['A school is required'],
    },
    {
      school: '1',
      expected: [true],
    },
  ]

  schoolTestCases.forEach(test => {
    it(`should validate school: ${test.school} as: ${test.expected}`, () => {
      const wrapper = factory({
        value: stop,
        schools: schoolsList,
      })

      stop.location.isSchool = true
      stop.location.school = test.school
      wrapper.vm.$data.viewModel = stop

      expect(wrapper.vm.schoolRules).toEqual(test.expected)
    })
  })

  it('should validate block number', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.blockNumberRules).toEqual([
      'A block number is required',
      'Block number plus street name must be between 5 and 250 characters',
    ])

    stop.location.blockNumber = '1000'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.blockNumberRules).toStrictEqual([true, true])
  })

  it('should validate street name', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRules).toEqual([
      'A street name is required',
      'Block number plus street name must be between 5 and 250 characters',
    ])

    stop.location.streetName = 'Anystreet St'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])
  })

  it('should validate intersection', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = ''
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = '5th and Main'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = null
    stop.location.blockNumber = '1000'
    stop.location.streetName = 'Anystreet St'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = '5th and Main'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])
  })

  it('should validate highway', () => {
    const wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.highwayRules).toEqual([
      'A highway and closest exit is required',
      'Highway and closest exit must be between 5 and 250 characters',
    ])

    stop.location.highwayExit = 'Exit 1A'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.highwayRules).toStrictEqual([true, true])
  })

  it('should validate landmark', () => {
    const wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.landmarkRules).toEqual([
      'A road marker, landmark, or other description is required',
      'Road marker, landmark or other description must be between 5 and 250 characters',
    ])

    stop.location.landmark = 'Exit 1A'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.landmarkRules).toStrictEqual([true, true])
  })

  it('should handle input', () => {
    const wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted().input[0][0]).toEqual(wrapper.vm.$data.viewModel)
  })

  it.todo('should handle input out of county')
  it.todo('should handle out of county toggle')
})
