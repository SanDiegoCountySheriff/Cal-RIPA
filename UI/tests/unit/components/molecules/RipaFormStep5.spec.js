import RipaFormStep5 from '@/components/molecules/RipaFormStep5.vue'
import { shallowMount } from '@vue/test-utils'
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
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
