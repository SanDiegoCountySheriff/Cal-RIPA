import RipaStopDate from '@/components/molecules/RipaStopDate.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import { format } from 'date-fns'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Stop Date', () => {
  let vuetify
  let stop
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = (propsData, provideData) => {
    return shallowMount(RipaStopDate, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        isAdminEditing: computed(() => provideData?.isAdminEditing ?? false),
      },
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
      wrapper = factory({ value: stop })

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

  it('should match snapshot', () => {
    wrapper = mount(RipaStopDate, {
      vuetify,
      propsData: {
        value: stop,
      },
      computed: {
        getMinDate: jest.fn(() => {
          return '2019-01-01'
        }),
        getMaxDate: jest.fn(() => {
          return '2019-12-31'
        }),
      },
      provide: {
        isAdminEditing: computed(() => false),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should validate admin date', () => {
    wrapper = factory({ value: stop }, { isAdminEditing: true })
    const inputDate = createDate(-2, 0, 0)

    stop.stopDate.date = inputDate
    wrapper.vm.$data.viewModel = stop

    wrapper.vm.dateRules.forEach(x =>
      expect(x(wrapper.vm.viewModel.stopDate.date)).toBe(true),
    )
  })

  timeTestCases.forEach(test => {
    it(`should validate time: ${test.time} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      wrapper = factory({ value: stop })

      stop.stopDate.time = test.time

      if (stop.stopDate.time < new Date()) {
        stop.stopDate.date = createDate(1, 0, 0)
      }

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
      wrapper = factory({ value: stop })

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
    wrapper = factory({ value: stop })

    wrapper.vm.handleInput()

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted().input[0][0]).toEqual(wrapper.vm.$data.viewModel)
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
