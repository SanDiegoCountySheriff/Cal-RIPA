import RipaFormSummaryDetail from '@/components/molecules/RipaFormSummaryDetail.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Form Summary Detail', () => {
  let vuetify
  let wrapper
  let apiStop

  beforeEach(() => {
    vuetify = new Vuetify()
    apiStop = API_STOP
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const shallowFactory = propsData => {
    return shallowMount(RipaFormSummaryDetail, {
      vuetify,
      propsData: {
        ...propsData,
        onDeletePerson: jest.fn(),
        onCopyPerson: jest.fn(),
        onEditAgencyQuestions: jest.fn(),
        onEditStop: jest.fn(),
        onEditPerson: jest.fn(),
      },
    })
  }

  const factory = propsData => {
    return mount(RipaFormSummaryDetail, {
      vuetify,
      propsData: {
        ...propsData,
        onDeletePerson: jest.fn(),
        onCopyPerson: jest.fn(),
        onEditAgencyQuestions: jest.fn(),
        onEditStop: jest.fn(),
        onEditPerson: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display gender correctly for legacy stops', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).toContain('Male')
    expect(wrapper.html()).not.toContain('Cisgender man/boy')
  })

  it('should display gender correctly for v2 stops', () => {
    apiStop.listPersonStopped[0].perceivedGender = 'Cisgender man/boy'
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).toContain('Cisgender man/boy')
    expect(wrapper.html()).not.toContain('Male')
  })
})
