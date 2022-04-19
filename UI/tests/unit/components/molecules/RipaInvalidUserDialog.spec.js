import RipaInvalidUserDialog from '@/components/molecules/RipaInvalidUserDialog.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Invalid User Dialog', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaInvalidUserDialog, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaInvalidUserDialog, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
