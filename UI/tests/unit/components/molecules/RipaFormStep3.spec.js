import RipaFormStep3 from '@/components/molecules/RipaFormStep3.vue'
import { shallowMount, mount } from '@vue/test-utils'
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
        loadingPiiStep3: computed(() => false),
        statutes: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
