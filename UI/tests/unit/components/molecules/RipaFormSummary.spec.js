import RipaFormSummary from '@/components/molecules/RipaFormSummary.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { API_STOP } from '../../constants/RipaFormContainerTestConstants'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Form Summary', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaFormSummary, {
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
    const apiStop = API_STOP
    wrapper = mount(RipaFormSummary, {
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
        isAdminViewing() {
          return false
        },
        isAdminEditing() {
          return false
        },
        statutes: computed(() => [{ id: 'test' }]),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
