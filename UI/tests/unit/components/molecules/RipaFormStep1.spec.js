import RipaFormStep1 from '@/components/molecules/RipaFormStep1.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import {
  V1_STOP,
  V2_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Form Step 1', () => {
  let vuetify
  let stop
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep1, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenFavorites: jest.fn(),
        onOpenLastLocation: jest.fn(),
        onSaveFavorite: jest.fn(),
        onGpsLocation: jest.fn(),
        onUpdateUser: jest.fn(),
      },
      computed: {
        getApiStopUser() {
          return {
            agency: 'SDSD',
            assignment: 10,
            otherType: 'Data Services',
            startDate: '2014-10-10',
            yearsExperience: 7,
          }
        },
      },
      provide: {
        isAdminEditing() {
          return false
        },
        isOnlineAndAuthenticated() {
          return true
        },
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display geolocation coordinates for v2 stop', () => {
    wrapper = mount(RipaFormStep1, {
      vuetify,
      propsData: {
        value: V2_STOP,
      },
    })

    expect(wrapper.html()).toContain('Latitude')
    expect(wrapper.html()).toContain('Longitude')
  })

  it('should not display geolocation coordinates for legacy stop', () => {
    wrapper = mount(RipaFormStep1, {
      vuetify,
      propsData: {
        value: V1_STOP,
      },
    })

    expect(wrapper.html()).not.toContain('Latitude')
    expect(wrapper.html()).not.toContain('Longitude')
  })
})
