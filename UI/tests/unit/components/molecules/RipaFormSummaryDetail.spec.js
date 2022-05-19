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

  it('should not display gender nonconforming for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).not.toContain('Gender Nonconforming')
  })

  it('should display gender nonconforming for legacy stops', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).toContain('Gender Nonconforming')
  })

  it('should display perceived unhoused for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Perceived Unhoused')
  })

  it('should not display perceived unhoused for legacy stops', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).not.toContain('Perceived Unhoused')
  })

  it('should not display stop type for legacy stop', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).not.toContain('Stop Type')
  })

  it('should display stop type for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Stop Type')
  })

  it('should display actions taken during stop for legacy stops', () => {
    wrapper = factory({ apiStop: apiStop })

    expect(wrapper.html()).toContain('Actions Taken During Stop')
    expect(wrapper.html()).not.toContain('Non-Force Actions Taken During Stop')
  })

  it('should display non-force actions taken during stop for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Non-Force Actions Taken During Stop')
  })
})
