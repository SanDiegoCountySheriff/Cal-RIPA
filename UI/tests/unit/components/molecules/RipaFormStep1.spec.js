import RipaFormStep1 from '@/components/molecules/RipaFormStep1.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Step 1', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
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
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
