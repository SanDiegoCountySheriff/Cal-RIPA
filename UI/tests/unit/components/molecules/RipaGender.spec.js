import RipaGender from '@/components/molecules/RipaGender.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'
import { V2_STOP } from '../../constants/RipaFormContainerTestConstants'

describe('Ripa Gender', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaGender, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaGender, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display nonBinaryPerson for v2 stop', () => {
    const v2Stop = V2_STOP
    v2Stop.person.nonBinaryPerson = true
    wrapper = mount(RipaGender, {
      vuetify,

      propsData: { value: v2Stop },

      provide: {
        isOnlineAndAuthenticated() {
          return true
        },

        lastResult() {
          return {}
        },
      },
    })

    expect(wrapper.html()).toContain('Nonbinary person')
  })

  it.skip('should display gender nonconforming for legacy stop', () => {
    wrapper = mount(RipaGender, {
      vuetify,

      propsData: { value: stop },

      provide: {
        isOnlineAndAuthenticated() {
          return true
        },

        lastResult() {
          return {}
        },
      },
    })

    expect(wrapper.html()).toContain('Gender Nonconforming')
  })
})
