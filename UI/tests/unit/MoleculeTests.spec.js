import { mount } from '@vue/test-utils'
import RipaStopDate from './../../src/components/molecules/RipaStopDate.vue'
import RipaLocation from './../../src/components/molecules/RipaLocation.vue'
import RipaModelMixin from './../../src/components/mixins/RipaModelMixin.vue'
import { defaultStop } from './../../src/utilities/stop.js'
import Vuetify from 'vuetify'
import { format } from 'date-fns'

describe('Ripa Stop Date', () => {
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaStopDate, {
      vuetify,
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  const dateTestCases = [
    {
      date: createDate(0, 0, 0),
      expectedFirstCase: true,
      expectedSecondCase: true,
    },
    {
      date: createDate(-2, 0, 0),
      expectedFirstCase: true,
      expectedSecondCase: 'Date and Time must be within the past 24 hours',
    },
    {
      date: null,
      expectedFirstCase: 'A date is required',
      expectedSecondCase: 'Date and Time must be within the past 24 hours',
    },
  ]

  const timeTestCases = [
    {
      time: createTime(0, 0),
      expectedFirstCase: true,
      expectedSecondCase: true,
    },
    {
      time: createTime(2, 0),
      expectedFirstCase: true,
      expectedSecondCase: 'Date and Time must be within the past 24 hours',
    },
    {
      time: null,
      expectedFirstCase: 'A time is required',
      expectedSecondCase: 'Date and Time must be within the past 24 hours',
    },
  ]

  const durationTestCases = [
    {
      duration: 15,
      expectedFirstCase: true,
      expectedSecondCase: true,
    },
    {
      duration: 0,
      expectedFirstCase: 'A duration is required',
      expectedSecondCase: 'Duration must be between 1 and 1440 minutes',
    },
    {
      duration: 1441,
      expectedFirstCase: true,
      expectedSecondCase: 'Duration must be between 1 and 1440 minutes',
    },
    {
      duration: null,
      expectedFirstCase: 'A duration is required',
      expectedSecondCase: 'Duration must be between 1 and 1440 minutes',
    },
  ]

  dateTestCases.forEach(test => {
    it(`should validate date: ${test.date} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      const wrapper = factory({ value: stop })

      stop.stopDate.date = test.date
      wrapper.vm.$data.viewModel = stop

      expect(wrapper.vm.dateRules[0](wrapper.vm.viewModel.stopDate.date)).toBe(
        test.expectedFirstCase,
      )
      expect(wrapper.vm.dateRules[1](wrapper.vm.viewModel.stopDate.date)).toBe(
        test.expectedSecondCase,
      )
    })
  })

  it('should validate admin date', () => {
    const wrapper = factory({ value: stop, adminEditing: true })
    const inputDate = createDate(-2, 0, 0)

    stop.stopDate.date = inputDate
    wrapper.vm.$data.viewModel = stop

    wrapper.vm.dateRules.forEach(x =>
      expect(x(wrapper.vm.viewModel.stopDate.date)).toBe(true),
    )
  })

  timeTestCases.forEach(test => {
    it(`should validate time: ${test.time} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      const wrapper = factory({ value: stop })

      stop.stopDate.time = test.time
      wrapper.vm.$data.viewModel = stop

      expect(wrapper.vm.timeRules[0](wrapper.vm.viewModel.stopDate.time)).toBe(
        test.expectedFirstCase,
      )
      expect(wrapper.vm.timeRules[1](wrapper.vm.viewModel.stopDate.time)).toBe(
        test.expectedSecondCase,
      )
    })
  })

  durationTestCases.forEach(test => {
    it(`should validate duration: ${test.duration} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      const wrapper = factory({ value: stop })

      stop.stopDate.duration = test.duration
      wrapper.vm.$data.viewModel = stop

      expect(
        wrapper.vm.durationRules[0](wrapper.vm.viewModel.stopDate.duration),
      ).toBe(test.expectedFirstCase)
      expect(
        wrapper.vm.durationRules[1](wrapper.vm.viewModel.stopDate.duration),
      ).toBe(test.expectedSecondCase)
    })
  })

  it('should handle input', () => {
    const wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted().input[0][0]).toEqual(wrapper.vm.$data.viewModel)
  })
})

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

    expect(wrapper.vm.blockNumberRules).toEqual(['A block number is required'])

    stop.location.blockNumber = '1000'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.blockNumberRules).toStrictEqual([true])
  })

  it('should validate street name', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRules).toEqual(['A street name is required'])

    stop.location.streetName = 'Anystreet St'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true])
  })

  it('should validate intersection', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
    ])

    stop.location.intersection = ''
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
    ])

    stop.location.intersection = '5th and Main'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true])

    stop.location.intersection = null
    stop.location.blockNumber = '1000'
    stop.location.streetName = 'Anystreet St'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true])

    stop.location.intersection = '5th and Main'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true])
  })

  it('should validate highway', () => {
    const wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.highwayRules).toEqual([
      'A highway and closest exit is required',
    ])

    stop.location.highwayExit = 'Exit 1A'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.highwayRules).toStrictEqual([true])
  })

  it('should validate landmark', () => {
    const wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.landmarkRules).toEqual([
      'A road marker, landmark, or other description is required',
    ])

    stop.location.landmark = 'Exit 1A'
    wrapper.vm.$data.viewModel = stop

    expect(wrapper.vm.landmarkRules).toStrictEqual([true])
  })

  it('should handle input', () => {
    const wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted().input[0][0]).toEqual(wrapper.vm.$data.viewModel)
  })

  it.todo('should handle input out of county')
  it.todo('should handle out of county toggle')
})

function createDate(days, months, years) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setMonth(date.getMonth() + months)
  date.setFullYear(date.getFullYear() + years)
  return format(date, 'yyyy-MM-dd')
}

function createTime(hours, minutes) {
  const time = new Date()
  time.setHours(time.getHours() + hours)
  time.setMinutes(time.getMinutes() + minutes)
  return format(time, 'kk:mm')
}
