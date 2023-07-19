import RipaFormSummaryDetail from '@/components/molecules/RipaFormSummaryDetail.vue'
import { mount } from '@vue/test-utils'
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
      provide: {
        isAdminEditing() {
          return true
        },
        isAdminViewing() {
          return false
        },
      },
    })
  }

  it.skip('should match snapshot', () => {
    wrapper = mount(RipaFormSummaryDetail, {
      vuetify,
      propsData: {
        apiStop,
        onDeletePerson: jest.fn(),
        onCopyPerson: jest.fn(),
        onEditAgencyQuestions: jest.fn(),
        onEditStop: jest.fn(),
        onEditPerson: jest.fn(),
      },
      provide: {
        isAdminEditing() {
          return true
        },
        isAdminViewing() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not display stop type for legacy stop', () => {
    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Stop Type')
  })

  it('should display stop type for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Stop Type')
  })

  it('should not display perceived unhoused for legacy stop', () => {
    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Perceived Unhoused')
  })

  it('should display perceived unhouse for v2 stop', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Perceived Unhoused')
  })

  it('should display officer race and gender details for v2 officer', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Officer Race')
    expect(wrapper.html()).toContain('Officer Gender')
  })

  it('should not display officer race and gender details for legacy stop', () => {
    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Officer Race')
    expect(wrapper.html()).not.toContain('Officer Gender')
  })

  it('should display non force actions and force actions taken for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Force')
    expect(wrapper.html()).toContain('Non-Force')
  })

  it('should display actions taken for legacy stops', () => {
    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Force')
    expect(wrapper.html()).not.toContain('Non-Force')
  })

  it('should display nonbinary person on v2 stops', () => {
    v2ApiStop.listPersonStopped[0].nonBinaryPerson = true

    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Nonbinary Person')
    expect(wrapper.html()).not.toContain('Gender Nonconforming')
  })

  it('should display gender nonconforming on legacy stops', () => {
    v2ApiStop.listPersonStopped[0].genderNonConforming = true

    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Nonbinary Person')
    expect(wrapper.html()).toContain('Gender Nonconforming')
  })
})
