import RipaList from '@/components/molecules/RipaList.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa List', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaList, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const item = {
    level: 1,
  }

  it('should match snapshot', () => {
    wrapper = factory({ item: item })

    expect(wrapper.element).toMatchSnapshot()
  })
})
