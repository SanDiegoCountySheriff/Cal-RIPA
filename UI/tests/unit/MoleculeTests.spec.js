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

  it('should validate date', () => {
    const wrapper = factory({ value: stop })
    const inputDate = format(createDate(-2, 0, 0), 'yyyy-MM-dd')

    wrapper.vm.dateRules.forEach(x =>
      expect(x(wrapper.vm.viewModel.stopDate.date)).toBe(true),
    )

    stop.stopDate.date = inputDate
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.dateRules[0](wrapper.vm.viewModel.stopDate.date)).toBe(
      true,
    )
    expect(wrapper.vm.dateRules[1](wrapper.vm.viewModel.stopDate.date)).toBe(
      'Date and Time must be within the past 24 hours',
    )

    stop.stopDate.date = null
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.dateRules[0](wrapper.vm.viewModel.stopDate.date)).toBe(
      'A date is required',
    )
  })

  it('should validate time', () => {
    const wrapper = factory({ value: stop })
    const inputTime = format(createTime(2, 0), 'kk:mm')

    wrapper.vm.timeRules.forEach(x =>
      expect(x(wrapper.vm.viewModel.stopDate.time)).toBe(true),
    )

    stop.stopDate.time = inputTime
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.timeRules[0](wrapper.vm.viewModel.stopDate.time)).toBe(
      true,
    )
    expect(wrapper.vm.timeRules[1](wrapper.vm.viewModel.stopDate.time)).toBe(
      'Date and Time must be within the past 24 hours',
    )

    stop.stopDate.time = null
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.timeRules[0](wrapper.vm.viewModel.stopDate.time)).toBe(
      'A time is required',
    )
  })

  it('should validate duration', () => {
    const wrapper = factory({ value: stop })
    stop.stopDate.duration = 15
    wrapper.vm._data.viewModel = stop

    wrapper.vm.durationRules.forEach(x =>
      expect(x(wrapper.vm.viewModel.stopDate.duration)).toBe(true),
    )

    stop.stopDate.duration = 0
    wrapper.vm._data.viewModel = stop

    expect(
      wrapper.vm.durationRules[0](wrapper.vm.viewModel.stopDate.duration),
    ).toBe('A duration is required')
    expect(
      wrapper.vm.durationRules[1](wrapper.vm.viewModel.stopDate.duration),
    ).toBe('Duration must be between 1 and 1440 minutes')

    stop.stopDate.duration = 1441
    wrapper.vm._data.viewModel = stop

    expect(
      wrapper.vm.durationRules[0](wrapper.vm.viewModel.stopDate.duration),
    ).toBe(true)
    expect(
      wrapper.vm.durationRules[1](wrapper.vm.viewModel.stopDate.duration),
    ).toBe('Duration must be between 1 and 1440 minutes')

    stop.stopDate.duration = null
    wrapper.vm._data.viewModel = stop

    expect(
      wrapper.vm.durationRules[0](wrapper.vm.viewModel.stopDate.duration),
    ).toBe('A duration is required')
  })
})

describe('Ripa Location', () => {
  let vuetify
  let stop
  let schools
  let countyCities
  let nonCountyCities

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
    schools = () => [
      {
        cdsCode: 1,
        name: 'High School',
      },
    ]
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

  it('should validate school', () => {
    const wrapper = factory({ value: stop }, { schools: schools })
    stop.location.isSchool = true
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.schoolRules).toEqual(['A school is required'])

    stop.location.school = schools[0]
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.schoolRules).toStrictEqual([true])
  })

  it('should validate block number', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.blockNumberRules).toEqual(['A block number is required'])

    stop.location.blockNumber = '1000'
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.blockNumberRules).toStrictEqual([true])
  })

  it('should validate street name', () => {
    const wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRules).toEqual(['A street name is required'])

    stop.location.streetName = 'Anystreet St'
    wrapper.vm._data.viewModel = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true])
  })
})

function createDate(days, months, years) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setMonth(date.getMonth() + months)
  date.setFullYear(date.getFullYear() + years)
  return date
}

function createTime(hours, minutes) {
  const time = new Date()
  time.setHours(time.getHours() + hours)
  time.setMinutes(time.getMinutes() + minutes)
  return time
}
