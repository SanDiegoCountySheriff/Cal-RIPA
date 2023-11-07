import RipaFavoritesGrid from '@/components/molecules/RipaFavoritesGrid.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Favorites Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFavoritesGrid, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFavoritesGrid, {
      vuetify,
      provide: {
        isOnlineAndAuthenticated() {
          return true
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
