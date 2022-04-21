import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa User Dialog', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaUserDialog, {
      vuetify,
      propsData: {
        ...propsData,
        onClose: jest.fn(),
        onSave: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaUserDialog, {
      vuetify,
      propsData: {
        user: {
          agency: 'SDSD',
          assignment: 10,
          otherType: 'Data Services',
          startDate: '2014-10-10',
          yearsExperience: 7,
        },
        onClose: jest.fn(),
        onSave: jest.fn(),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
