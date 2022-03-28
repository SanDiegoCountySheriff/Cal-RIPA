import RipaUser from '@/components/molecules/RipaUser.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa User', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaUser, {
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

    expect(wrapper.element).toMatchSnapshot()
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
