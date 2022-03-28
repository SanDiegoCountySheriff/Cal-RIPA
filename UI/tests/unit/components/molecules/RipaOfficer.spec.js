import RipaOfficer from '@/components/molecules/RipaOfficer.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Officer', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaOfficer, {
      vuetify,
      propsData: {
        ...propsData,
        onUpdateUser: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
