import RipaUser from '@/components/molecules/RipaUser.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

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

  it('should disable officer race when admin editing', () => {
    wrapper = factory({
      value: {
        agency: 'SDSD',
        assignment: 10,
        officerRace: 'White',
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
      adminEditing: true,
    })

    expect(wrapper.vm.officerRaceDisabled).toBeTruthy()
  })

  it.todo('should validate years experience rules')

  it.todo('should validate agency rules')

  it.todo('should validate assignment rules')

  it.todo('should validate first name rules')

  it.todo('should validate last name rules')

  it.todo('should validate start date rules')

  it.todo('should validate other type rules')

  it.todo('should get max date')

  it.todo('should handle input')

  it.todo('should update start date model')

  it.todo('should update other type model')

  it.todo('should watch value')
})
