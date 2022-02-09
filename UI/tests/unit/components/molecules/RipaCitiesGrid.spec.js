import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Cities Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaCitiesGrid, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should watch items', async () => {
    wrapper = factory()

    wrapper.setProps({ items: ['item1'] })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.cities).toEqual(['item1'])
  })
})
