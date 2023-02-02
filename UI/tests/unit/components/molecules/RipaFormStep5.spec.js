import RipaFormStep5 from '@/components/molecules/RipaFormStep5.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { computed } from 'vue'
import Vuetify from 'vuetify'

describe('Ripa Form Step 5', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep5, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep5, {
      vuetify,
      propsData: {
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
        lastResult() {
          return {}
        },
        statutes: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
