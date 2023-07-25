import RipaFormStep1 from '@/components/molecules/RipaFormStep1.vue'
import { shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
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
        loadingPiiStep1: computed(() => false),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
