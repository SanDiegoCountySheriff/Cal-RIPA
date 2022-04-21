import RipaLabel from '@/components/atoms/RipaLabel'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'

describe('Ripa Label', () => {
  let vuetify
  let wrapper = null

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaLabel, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaLabel, { vuetify })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should return bold font', () => {
    wrapper = factory({ bold: true })

    expect(wrapper.vm.boldClass).toEqual('tw-font-bold')
  })
})
