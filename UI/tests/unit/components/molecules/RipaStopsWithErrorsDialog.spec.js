import RipaStopsWithErrorsDialog from '@/components/molecules/RipaStopsWithErrorsDialog.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import { computed } from 'vue'

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
      provide: {
        stopsWithErrors: computed(() => []),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopsWithErrorsDialog, {
      vuetify,
      provide: {
        stopsWithErrors: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
