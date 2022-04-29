import RipaUser from '@/components/molecules/RipaUser.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import format from 'date-fns/format'
import endOfDay from 'date-fns/endOfDay'

describe('Ripa User', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const shallowFactory = propsData => {
    return shallowMount(RipaUser, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const factory = propsData => {
    return mount(RipaUser, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should include officer race input', () => {
    wrapper = factory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.html()).toContain('Officer Race')
  })

  it('should validate officer race rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.raceRules[0]('')).toEqual('An officer race is required')
    expect(wrapper.vm.raceRules[0]('White')).toEqual(true)
  })

  it('should display officer race correctly', () => {
    wrapper = factory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        officerRace: 'White',
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.html()).toContain('White')
  })

  it('should validate years experience rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.yearsExperienceRules[0](null)).toEqual(
      'Years of Experience is required',
    )
    expect(wrapper.vm.yearsExperienceRules[0](1)).toEqual(true)
    expect(wrapper.vm.yearsExperienceRules[1](0)).toEqual(
      'Years of Experience must be between 1 and 50 Years',
    )
    expect(wrapper.vm.yearsExperienceRules[1](1)).toEqual(true)
  })

  it('should validate agency rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.agencyRules[0](null)).toEqual('An agency is required')
    expect(wrapper.vm.agencyRules[0]('Agency')).toEqual(true)
  })

  it('should validate assignment rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.assignmentRules[0](null)).toEqual(
      'An assignment is required',
    )
    expect(wrapper.vm.assignmentRules[0]('Assignment')).toEqual(true)
  })

  it('should validate first name rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.firstNameRules[0](null)).toEqual(
      'A first name is required',
    )
    expect(wrapper.vm.firstNameRules[0]('FirstName')).toEqual(true)
  })

  it('should validate last name rules', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.lastNameRules[0](null)).toEqual('A last name is required')
    expect(wrapper.vm.lastNameRules[0]('LastName')).toEqual(true)
  })

  it('should validate start date rules', async () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.startDateRules).toEqual([true, true, true])

    wrapper.setProps({ value: {} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.startDateRules).toEqual([
      'Start date is required',
      'Start date is not a valid date',
      'Start date is in the future',
    ])
  })

  it('should validate other type rules', async () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.otherTypeRules).toEqual([true, true, true])

    wrapper.setProps({ value: { assignment: 10, otherType: '' } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.otherTypeRules).toEqual([
      'Other type is required',
      true,
      'Min 5 characters',
    ])

    wrapper.setProps({ value: { assignment: 9 } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.otherTypeRules).toEqual([])
  })

  it('should get max date', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.vm.getMaxDate).toEqual(
      format(endOfDay(new Date()), `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`),
    )
  })

  it('should handle input', () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })
    const updateStartDateModel = jest.spyOn(wrapper.vm, 'updateStartDateModel')
    const updateOtherTypeModel = jest.spyOn(wrapper.vm, 'updateOtherTypeModel')

    wrapper.vm.handleInput()

    expect(updateStartDateModel).toHaveBeenCalled()
    expect(updateOtherTypeModel).toHaveBeenCalled()
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toEqual({
      agency: 'SDSD',
      assignment: 10,
      otherType: 'Data Services',
      startDate: '2014-10-10',
      yearsExperience: 7,
    })
  })

  it('should update start date model', async () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    wrapper.setProps({ value: { startDate: null } })
    await wrapper.vm.$nextTick()

    wrapper.vm.updateStartDateModel()

    expect(wrapper.vm.viewModel.startDate).toEqual(null)
  })

  it('should update other type model', async () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    wrapper.setProps({ value: { assignment: 9, otherType: 'otherType' } })
    await wrapper.vm.$nextTick()

    wrapper.vm.updateOtherTypeModel()

    expect(wrapper.vm.viewModel.othertype).not.toEqual('otherType')
  })

  it('should watch value', async () => {
    wrapper = shallowFactory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    wrapper.setProps({ value: { agency: 'San Diego' } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual({ agency: 'San Diego' })
  })
})
