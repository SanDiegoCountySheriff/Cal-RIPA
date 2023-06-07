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

  const factory = (propsData, provide) => {
    return shallowMount(RipaConfirmation, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        ...provide,
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

  it('should render if not authenticated', () => {
    wrapper = factory(
      { value: stop },
      {
        isAuthenticated() {
          return false
        },
        loading() {
          return false
        },
      },
    )

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render if loading', () => {
    wrapper = factory(
      { value: stop },
      {
        isAuthenticated() {
          return true
        },
        loading() {
          return true
        },
      },
    )

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render if loading and not authenticated', () => {
    wrapper = factory(
      { value: stop },
      {
        isAuthenticated() {
          return false
        },
        loading() {
          return true
        },
      },
    )

    expect(wrapper.html()).toMatchSnapshot()
  })
})
