import RipaStopDate from '@/components/molecules/RipaStopDate.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import { format } from 'date-fns'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { computed } from 'vue'
import { V2_STOP } from '../../constants/RipaFormContainerTestConstants'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Ripa Stop Date', () => {
  let vuetify
  let stop
  let wrapper = null
  let stopV2
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
    stopV2 = V2_STOP

    // Create a mock store
    store = new Vuex.Store({
      getters: {
        stopDateLimitDays: () => null, // Default to no limit
      },
    })
  })

  const factory = (propsData, provideData) => {
    return shallowMount(RipaStopDate, {
      vuetify,
      store,
      localVue,
      propsData: {
        ...propsData,
      },
      provide: {
        isAdminEditing: computed(() => provideData?.isAdminEditing ?? false),
        environmentName: computed(() => 'QA'),
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
    it.skip(`should validate date: ${test.date} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      wrapper = factory({ value: stop })

      stop.stopDate.date = test.date
      wrapper.vm.model = { ...stop }
      wrapper.vm.$forceUpdate()

      expect(wrapper.vm.dateRules[0](wrapper.vm.model.stopDate.date)).toBe(
        test.expectedFirstCase,
      )
      expect(wrapper.vm.dateRules[1](wrapper.vm.model.stopDate.date)).toBe(
        test.expectedSecondCase,
      )
    })
  })

  it('should match snapshot', () => {
    wrapper = mount(RipaStopDate, {
      vuetify,
      store,
      localVue,
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
        environmentName: computed(() => 'DEV'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should validate admin date', () => {
    wrapper = factory({ value: stop }, { isAdminEditing: true })
    const inputDate = createDate(-2, 0, 0)

    stop.stopDate.date = inputDate
    wrapper.vm.model = stop

    wrapper.vm.dateRules.forEach(x =>
      expect(x(wrapper.vm.model.stopDate.date)).toBe(true),
    )
  })

  timeTestCases.forEach(test => {
    it.skip(`should validate time: ${test.time} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      wrapper = factory({ value: stop })

      stop.stopDate.time = test.time
      if (stop.stopDate.time < new Date()) {
        stop.stopDate.date = createDate(1, 0, 0)
      }
      wrapper.vm.model = { ...stop }
      wrapper.vm.$forceUpdate()

      expect(wrapper.vm.timeRules[0](wrapper.vm.model.stopDate.time)).toBe(
        test.expectedFirstCase,
      )
      expect(wrapper.vm.timeRules[1](wrapper.vm.model.stopDate.time)).toBe(
        test.expectedSecondCase,
      )
    })
  })

  durationTestCases.forEach(test => {
    it.skip(`should validate duration: ${test.duration} as: "${test.expectedFirstCase}" and "${test.expectedSecondCase}"`, () => {
      wrapper = factory({ value: stop })

      stop.stopDate.duration = test.duration
      wrapper.vm.model = { ...stop }
      wrapper.vm.$forceUpdate()

      expect(
        wrapper.vm.durationRules[0](wrapper.vm.model.stopDate.duration),
      ).toBe(test.expectedFirstCase)
      expect(
        wrapper.vm.durationRules[1](wrapper.vm.model.stopDate.duration),
      ).toBe(test.expectedSecondCase)
    })
  })

  it('should display welfare check switch for v2 stops', () => {
    wrapper = factory({ value: stopV2 })

    expect(wrapper.html()).toContain('Welfare')
  })

  it('should not display welfare check switch for legacy stops', () => {
    stop.stopVersion = 1
    wrapper = factory({ value: stop })

    expect(wrapper.html()).not.toContain('Welfare')
  })

  it('should enforce date limit when StopDateLimitDays is configured', () => {
    // Test with 7 days limit
    store = new Vuex.Store({
      getters: {
        stopDateLimitDays: () => 7, // 7 additional days beyond 24 hours
      },
    })

    wrapper = factory({ value: stop }, { isAdminEditing: false })

    // Set a date that's 10 days old (beyond 24 hours + 7 days limit)
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
    stop.stopDate.date = format(tenDaysAgo, 'yyyy-MM-dd')
    stop.stopDate.time = '12:00'
    wrapper.vm.model = stop

    // The date rules should return an error message for dates beyond the limit
    const dateRules = wrapper.vm.dateRules
    const result = dateRules[2](stop.stopDate.date) // Third rule is the configurable limit rule
    expect(result).toContain('Date cannot be more than')
    expect(result).toContain('hours in the past')
  })

  it('should not enforce date limit when StopDateLimitDays is null', () => {
    // Test with no limit (null)
    store = new Vuex.Store({
      getters: {
        stopDateLimitDays: () => null,
      },
    })

    wrapper = factory({ value: stop }, { isAdminEditing: false })

    // Set a date that's very old
    const veryOldDate = new Date()
    veryOldDate.setDate(veryOldDate.getDate() - 100)
    stop.stopDate.date = format(veryOldDate, 'yyyy-MM-dd')
    stop.stopDate.time = '12:00'
    wrapper.vm.model = stop

    // The date rules should not include the configurable limit rule
    const dateRules = wrapper.vm.dateRules
    expect(dateRules).toHaveLength(2) // Only required and future date rules
  })

  it('should not enforce date limit for admin users', () => {
    // Test with 7 days limit but admin editing
    store = new Vuex.Store({
      getters: {
        stopDateLimitDays: () => 7,
      },
    })

    wrapper = factory({ value: stop }, { isAdminEditing: true })

    // Set a date that's 10 days old (beyond limit)
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
    stop.stopDate.date = format(tenDaysAgo, 'yyyy-MM-dd')
    stop.stopDate.time = '12:00'
    wrapper.vm.model = stop

    // The date rules should not include the configurable limit rule for admin
    const dateRules = wrapper.vm.dateRules
    expect(dateRules).toHaveLength(2) // Only required and future date rules
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
