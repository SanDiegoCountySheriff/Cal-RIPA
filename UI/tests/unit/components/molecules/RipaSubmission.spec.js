import RipaSubmission from '@/components/molecules/RipaSubmission.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Submission', () => {
  let vuetify
  let wrapper
  let defaultSubmission

  beforeEach(() => {
    vuetify = new Vuetify()
    defaultSubmission = {
      stops: [],
      submission: {
        id: 1,
        dateSubmitted: '2022-03-11T00:00:00',
        errorCount: 0,
        maxStopDate: '2022-02-14T00:00:00',
        minStopDate: '2022-02-14T00:00:00',
        officerId: '1',
        officerName: 'Officer Name',
        recordCount: 1,
      },
      summary: [],
    }
  })

  const factory = propsData => {
    return shallowMount(RipaSubmission, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaSubmission, {
      vuetify,
      propsData: {
        submission: defaultSubmission,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.todo('should handle back to submission')

  it.todo('should handle next page')

  it.todo('should handle previous page')

  it.todo('should handle sort')

  it.todo('should handle jump to page')

  it.todo('should handle update items per page')

  it.todo('should edit item')

  it.todo('should get column sort name')

  it.todo('should handle change error code filter')

  it.todo('should get total stops')

  it.todo('should get pagination length')

  it.todo('should calculate items to')

  it.todo('should calculate items from')

  it.todo('should get filter status')

  it.todo('should watch submissionId')

  it.todo('should watch sortDesc')
})
