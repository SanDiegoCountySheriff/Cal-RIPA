import RipaStopsWithErrorsDialog from '@/components/molecules/RipaStopsWithErrorsDialog.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Stops With Errors Dialog', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaStopsWithErrorsDialog, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopsWithErrorsDialog, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
