import RipaFormStep3 from '@/components/molecules/RipaFormStep3.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { V1_STOP } from '../../constants/RipaFormContainerTestConstants'
import { computed } from 'vue'
import Vuetify from 'vuetify'

describe('Ripa Form Step 3', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep3, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep3, {
      vuetify,
      propsData: {
        value: V1_STOP,
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastReason() {
          return {}
        },
        personSearchAutomaticallySelected() {
          return false
        },
        propertySearchAutomaticallySelected() {
          return false
        },
        loadingPiiStep3: computed(() => false),
        statutes: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
