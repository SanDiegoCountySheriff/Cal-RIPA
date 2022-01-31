import RipaAppBar from '@/components/molecules/RipaAppBar'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa App Bar', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaAppBar, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.todo('should get theme icon')

  it.todo('should get theme tooltip')

  it.todo('should get app title')

  it.todo('should get admin')

  it.todo('should get online icon')

  it.todo('should get app bar background class')

  it.todo('should handle view stops with errors')

  it.todo('should handle theme change')

  it.todo('should handle auth')

  it.todo('should handle logout')

  it.todo('should handle login')

  it.todo('should handle user change')

  it.todo('should handle before destroy')
})
