import RipaFormSummaryDetail from '@/components/molecules/RipaFormSummaryDetail.vue'
import { mount } from '@vue/test-utils'
import {
  API_STOP,
  V2_API_STOP,
  V2_STOP,
} from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'
import { computed } from 'vue'

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
        statutes: computed(() => [{ id: 'test' }]),
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
        statutes: computed(() => [{ id: 'test' }]),
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

  it('should display person inside residence only when stop type is pedestrian', () => {
    const updatedStop = v2ApiStop
    updatedStop.stopType = 'pedestrian'
    updatedStop.listPersonStopped[0].insideResidence = true

    wrapper = factory({ apiStop: updatedStop })

    expect(wrapper.html()).toContain('Inside Residence')
  })

  it('should display person passenger in vehicle only when stop type is vehicular', () => {
    const updatedStop = v2ApiStop
    updatedStop.stopType = 'Vehicular'
    updatedStop.listPersonStopped[0].passengerInVehicle = true

    wrapper = factory({ apiStop: updatedStop })

    expect(wrapper.html()).toContain('Passenger In Vehicle')
  })

  it.skip('should display officer race and gender details for v2 officer', () => {
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

  it('should display verbal and written warning for v2 stops', () => {
    v2ApiStop.listPersonStopped[0].listResultOfStop = [
      {
        key: '2',
        result: 'Verbal Warning',
        listCodes: [
          {
            code: '31286',
            text: '10085.5 BP - ADV FEE/SECURE LOAN (M) 31286',
          },
        ],
      },
      {
        key: '3',
        result: 'Written Warning',
        listCodes: [
          {
            code: '31286',
            text: '10085.5 BP - ADV FEE/SECURE LOAN (M) 31286',
          },
        ],
      },
    ]
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Verbal Warning')
    expect(wrapper.html()).toContain('Written Warning')
  })

  it('should display welfare summary for v2 stops', () => {
    wrapper = factory({ apiStop: v2ApiStop })

    expect(wrapper.html()).toContain('Welfare')
  })

  it('should not display welfare summary for legacy stops', () => {
    wrapper = factory({ apiStop })

    expect(wrapper.html()).not.toContain('Welfare')
  })
})
