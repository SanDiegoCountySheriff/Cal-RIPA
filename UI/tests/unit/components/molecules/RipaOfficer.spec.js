import RipaOfficer from '@/components/molecules/RipaOfficer.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Officer', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaOfficer, {
      vuetify,
      propsData: {
        ...propsData,
        onUpdateUser: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaOfficer, {
      vuetify,
      propsData: {
        onUpdateUser: jest.fn(),
      },
      provide: {
        user: () => {},
        stopVersion: () => 1,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
