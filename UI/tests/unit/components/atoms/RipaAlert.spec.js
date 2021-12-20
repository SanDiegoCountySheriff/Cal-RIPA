import { mount } from '@vue/test-utils'
import RipaAlert from '@/components/atoms/RipaAlert.vue'
import Vuetify from 'vuetify'

describe('Ripa Alert', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = (propsData, slotsData = '') => {
    return mount(RipaAlert, {
      vuetify,
      propsData: {
        ...propsData,
      },
      slots: {
        default: slotsData,
      },
    })
  }

  it('should display the default alert type and outline', () => {
    wrapper = factory()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display warning and default outline', () => {
    wrapper = factory({ alertType: 'warning' })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display outline', () => {
    wrapper = factory({ alertOutlined: true })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display slot data', () => {
    wrapper = factory({}, 'Test Slot Data')
    expect(wrapper.html()).toContain('Test Slot Data')
  })
})
