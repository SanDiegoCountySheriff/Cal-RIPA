import RipaFormStep7 from '@/components/molecules/RipaFormStep7.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'
import { defaultStop } from '@/utilities/stop'

import Vuetify from 'vuetify'

describe('Ripa Form Step 7', () => {
  let vuetify
  let stop
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaFormStep7, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    const apiStop = API_STOP
    wrapper = mount(RipaFormStep7, {
      vuetify,
      propsData: { value: stop, apiStop },
      provide: {
        isAdminEditing() {
          return false
        },
        isAdminViewing() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
