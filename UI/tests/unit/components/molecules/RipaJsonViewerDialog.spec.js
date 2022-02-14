import RipaJsonViewerDialog from '@/components/molecules/RipaJsonViewerDialog.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa JSON Viewer Dialog', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaJsonViewerDialog, {
      vuetify,
      propsData: {
        ...propsData,
        onClose: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })
})
