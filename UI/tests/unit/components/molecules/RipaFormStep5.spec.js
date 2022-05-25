import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Form Step 5', () => {
  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return mount(RipaFormStep5, {
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

  it.todo('should handle step 5 next')

  it.todo('should get model')

  it.todo('should handle close dialog')

  it.todo('should handle input')

  it.todo('should watch value')
})
