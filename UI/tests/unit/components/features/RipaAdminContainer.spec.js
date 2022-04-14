import RipaAdminContainer from '@/components/features/RipaAdminContainer'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe('Ripa Admin Container', () => {
  let wrapper
  let vuetify
  let actions
  let getters
  let store
  const routes = [
    {
      path: '/',
      component: RipaAdminContainer,
    },
  ]
  const router = new VueRouter({ routes })

  beforeEach(() => {
    vuetify = new Vuetify()
    actions = {
      getAdminStops: jest.fn(),
      createCpraReport: jest.fn(() => Promise.resolve('message')),
      downloadCpraReport: jest.fn(() => Promise.resolve('message')),
      uploadDomain: jest.fn(() => Promise.resolve('message')),
      uploadUsers: jest.fn(() => Promise.resolve('message')),
    }
    getters = {
      mappedAdminBeats: jest.fn(),
      mappedUser: jest.fn(),
      mappedAdminCities: jest.fn(),
      mappedAdminSchools: jest.fn(),
      mappedAdminStatutes: jest.fn(),
      mappedAdminStops: jest.fn(),
      mappedAdminSubmissions: jest.fn(),
      mappedAdminSubmission: jest.fn(),
      mappedAdminUsers: jest.fn(),
      mappedErrorCodeAdminSearch: jest.fn(),
      displayBeatInput: jest.fn(),
      mappedAdminHistoricalCpraReports: jest.fn(),
      mappedAdminCpraReportStats: jest.fn(),
      stopQueryData: jest.fn(),
    }
    store = new Vuex.Store({
      actions,
      getters,
    })
  })

  const factory = propsData => {
    return shallowMount(RipaAdminContainer, {
      router,
      store,
      localVue,
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  const submitAllTestCases = [
    {
      test: 'success',
      returnValue: { submissionId: 1 },
      expected: 'All stops were submitted',
    },
    {
      test: 'null id',
      returnValue:
        'There was an unknown error with your submission. Your stops were not submitted',
      expected:
        'Submission error: There was an unknown error with your submission. Your stops were not submitted',
    },
  ]

  const submitStopsTestCases = [
    {
      test: 'success',
      returnValue: { submissionId: 1 },
      expected: '2 stops were submitted',
    },
    {
      test: 'null id',
      returnValue:
        'There was an unknown error with your submission. Your stops were not submitted',
      expected:
        'Submission error: There was an unknown error with your submission. Your stops were not submitted',
    },
  ]

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should display toast message for handleCreateCpraReport', async () => {
    wrapper = factory()
    const expected = 'message'

    await wrapper.vm.handleCreateCpraReport({})

    expect(wrapper.vm.snackbarText).toEqual(expected)
  })

  it('should display toast message for handleDownloadCpraReport', async () => {
    wrapper = factory()
    const expected = 'message'

    await wrapper.vm.handleDownloadCpraReport({})

    expect(wrapper.vm.snackbarText).toEqual(expected)
  })

  it('should display toast message for handleUploadDomain', async () => {
    wrapper = factory()
    const expected = 'message'

    await wrapper.vm.handleUploadDomain({})

    expect(wrapper.vm.snackbarText).toEqual(expected)
  })

  it('should display toast message for handleUploadUsers', async () => {
    wrapper = factory()
    const expected = 'message'

    await wrapper.vm.handleUploadUsers({})

    expect(wrapper.vm.snackbarText).toEqual(expected)
  })

  submitAllTestCases.forEach(test => {
    it(`should display toast message for ${test.test} handleSubmitAll`, async () => {
      wrapper = factory()
      wrapper.vm.submitAllStops = jest.fn(() =>
        Promise.resolve(test.returnValue),
      )

      await wrapper.vm.handleSubmitAll({})

      expect(wrapper.vm.snackbarText).toEqual(test.expected)
    })
  })

  submitStopsTestCases.forEach(test => {
    it(`should display toast message for ${test.test} handleSubmitStops`, async () => {
      wrapper = factory()
      wrapper.vm.submitStops = jest.fn(() => Promise.resolve(test.returnValue))

      await wrapper.vm.handleSubmitStops([1, 2])

      expect(wrapper.vm.snackbarText).toEqual(test.expected)
    })
  })
})
