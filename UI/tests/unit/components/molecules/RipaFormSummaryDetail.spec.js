import RipaFormSummaryDetail from '@/components/molecules/RipaFormSummaryDetail.vue'
import { shallowMount, mount } from '@vue/test-utils'
import {
  API_STOP,
  V2_API_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'

describe('Ripa Form Summary Detail', () => {
  let vuetify
  let wrapper
  let apiStop
  let v2ApiStop

  beforeEach(() => {
    vuetify = new Vuetify()
    apiStop = API_STOP
    v2ApiStop = V2_API_STOP
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

  it('should display officer race in summary', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Officer Race')
    expect(wrapper.html()).toContain('White')
  })

  it('should display officer gender in summary', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Officer Gender')
    expect(wrapper.html()).toContain('Male')
  })
})
