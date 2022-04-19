import RipaContraband from '@/components/molecules/RipaContraband.vue'
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
    return shallowMount(RipaContraband, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaContraband, { vuetify, propsData: { value: stop } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.todo('should compute model')

  it.todo('should compute contraband rules')

  it.todo('should compute is any contraband disabled')

  it.todo('should handle input')

  it.todo('should watch value')
})
