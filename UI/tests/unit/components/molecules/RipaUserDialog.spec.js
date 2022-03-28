import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa User Dialog', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaUserDialog, {
      vuetify,
      propsData: {
        onClose: jest.fn(),
        onSave: jest.fn(),
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({
      user: {
        agency: 'SDSD',
        assignment: 10,
        otherType: 'Data Services',
        startDate: '2014-10-10',
        yearsExperience: 7,
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
