import RipaForceActionsTaken from '@/components/molecules/RipaForceActionsTaken'
import Vuetify from 'vuetify'
import { defaultStop } from '@/utilities/stop.js'
import { mount } from '@vue/test-utils'

describe('Ripa Force Actions Taken', () => {
  let wrapper
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return mount(RipaForceActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.todo('should validate force action rules')
})
