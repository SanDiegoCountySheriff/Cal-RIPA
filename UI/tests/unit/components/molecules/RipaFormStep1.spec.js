import RipaFormStep1 from '@/components/molecules/RipaFormStep1.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import {
  V1_STOP,
  V2_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Form Step 1', () => {
  let vuetify
  let stop
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const shallowFactory = propsData => {
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
        loadingPiiStep1: computed(() => false),
      },
    })
  }

  const factory = propsData => {
    return mount(RipaFormStep1, {
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
        loadingPiiStep1: computed(() => false),
        validLastLocation: computed(() => true),
        loadingGps: computed(() => false),
        lastLocation: computed(() => null),
        displayBeatInput: computed(() => true),
        schools: computed(() => []),
        nonCountyCities: computed(() => []),
        countyCities: computed(() => []),
        beats: computed(() => []),
        user: computed(() => null),
        version: computed(() => 1),
        environmentName: computed(() => 'dev'),
      },
    })
  }

  it.skip('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display geolocation coordinates for v2 stop', () => {
    wrapper = factory({ value: V2_STOP })

    expect(wrapper.html()).toContain('Latitude')
    expect(wrapper.html()).toContain('Longitude')
  })

  it('should not display geolocation coordinates for legacy stop', () => {
    wrapper = factory({ value: V1_STOP })

    expect(wrapper.html()).not.toContain('Latitude')
    expect(wrapper.html()).not.toContain('Longitude')
  })
})
