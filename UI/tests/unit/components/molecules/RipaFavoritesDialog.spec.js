import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Favorites Dialog', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const shallowFactory = propsData => {
    return shallowMount(RipaFavoritesDialog, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        version() {
          return 1
        },
      },
    })
  }

  const factory = propsData => {
    return mount(RipaFavoritesDialog, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        version() {
          return 1
        },
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
