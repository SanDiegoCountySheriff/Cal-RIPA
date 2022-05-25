import RipaFormStep6 from '@/components/molecules/RipaFormStep6.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Step 6', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep6, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaFormStep6, {
      vuetify,
      propsData: {
        onOpenFavorites: jest.fn(),
        onSaveFavorite: jest.fn(),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
