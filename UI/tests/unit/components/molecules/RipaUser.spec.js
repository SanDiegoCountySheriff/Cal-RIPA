import RipaUser from '@/components/molecules/RipaUser.vue'
import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa User', () => {
  let wrapper
  let vuetify
  let ripaUserV2
  let ripaUser

  beforeEach(() => {
    vuetify = new Vuetify()
    ripaUserV2 = {
      agency: 'SDSD',
      assignment: 10,
      otherType: 'Data Services',
      startDate: '2014-10-10',
      yearsExperience: 7,
      officerRace: ['Asian'],
      officerGender: 'Cisgender man',
      officerNonBinary: false,
    }
    ripaUser = {
      agency: 'SDSD',
      assignment: 10,
      otherType: 'Data Services',
      startDate: '2014-10-10',
      yearsExperience: 7,
    }
  })

  const factory = (propsData, version) => {
    return mount(RipaUser, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        version,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaUser, {
      vuetify,
      propsData: {
        value: {
          agency: 'SDSD',
          assignment: 10,
          otherType: 'Data Services',
          startDate: '2014-10-10',
          yearsExperience: 7,
          race: ['Asian'],
          gender: 'Cisgender man',
          officerNonBinary: false,
        },
      },
      provide: {
        version: 2,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should validate officer race rules', () => {
    wrapper = factory(
      {
        value: ripaUserV2,
      },
      2,
    )

    expect(wrapper.vm.raceRules[0](null)).toEqual('An officer race is required')
    expect(wrapper.vm.raceRules[0](['test'])).toEqual(true)
  })

  it.skip('should validate officer gender rules', () => {
    wrapper = factory(
      {
        value: {
          agency: 'SDSD',
          assignment: 10,
          otherType: 'Data Services',
          startDate: '2014-10-10',
          yearsExperience: 7,
          race: ['Asian'],
          gender: null,
          officerNonBinary: false,
        },
      },
      2,
    )

    expect(wrapper.vm.genderRules).toEqual([
      'If no gender is selected, nonbinary must be selected',
    ])
  })

  it.skip('should display officer race and gender inputs if current date > 01/01/24', () => {
    wrapper = factory(
      {
        value: ripaUserV2,
      },
      2,
    )

    expect(wrapper.html()).toContain('Officer Gender')
    expect(wrapper.html()).toContain('Officer Race')
  })

  it('should display new assignment off duty for v2 stop', () => {
    ripaUserV2.assignment = 11
    wrapper = factory(
      {
        value: ripaUserV2,
      },
      2,
    )
    expect(wrapper.html()).toContain('Off duty and/or working private event')
  })

  it('should display new assignment contracted by another agency for v2 stop', () => {
    ripaUserV2.assignment = 12
    wrapper = factory(
      {
        value: ripaUserV2,
      },
      2,
    )
    expect(wrapper.html()).toContain(
      'Contracted by another law enforcement agency',
    )
  })

  it('should not display new assignment types for v1 stop', () => {
    wrapper = factory(
      {
        value: ripaUser,
      },
      1,
    )
    expect(wrapper.html()).not.toContain(
      'Off duty and/or working private event',
    )
    expect(wrapper.html()).not.toContain(
      'Contracted by another law enforcement agency',
    )
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
