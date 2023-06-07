import RipaConfirmation from '@/components/molecules/RipaConfirmation.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'

describe('Ripa Contraband', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    stop = defaultStop()
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaConfirmation, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        isAuthenticated() {
          return true
        },
        loading() {
          return false
        },
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaConfirmation, {
      vuetify,
      propsData: { value: stop },
      provide: {
        isAuthenticated() {
          return true
        },
        loading() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should call onGoHome', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.onGoHome()

    expect(wrapper.emitted('go-home')).toBeTruthy()
  })

  it('should call onStartNew', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.onStartNew()

    expect(wrapper.emitted('on-start-new')).toBeTruthy()
  })
})
