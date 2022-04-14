import RipaAccordion from '@/components/molecules/RipaAccordion'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Accordion', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaAccordion, {
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

  it('should format stop date', () => {
    wrapper = factory()

    const dateInput = new Date(2020, 11, 25, 6, 0, 0, 0)
    const expectedDate = '12-25-2020 06:00'
    const actualDate = wrapper.vm.formatStopDate(dateInput)

    expect(actualDate).toEqual(expectedDate)
  })
})
