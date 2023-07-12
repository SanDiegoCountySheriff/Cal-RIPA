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

  it.todo(
    'should display non force actions and force actions taken for v2 stops',
  )

  it.todo('should display actions taken for legacy stops')
})
