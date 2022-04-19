import RipaList from '@/components/molecules/RipaList.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa List', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
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
    wrapper = mount(RipaList, {
      vuetify,
      propsData: {
        item: item,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
