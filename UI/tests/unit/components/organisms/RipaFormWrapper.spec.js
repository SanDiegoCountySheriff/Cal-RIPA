import RipaFormWrapper from '@/components/organisms/RipaFormWrapper.vue'
import RipaSelect from '@/components/atoms/RipaSelect.vue'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup.vue'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import store from '@/store'
import { computed } from 'vue'
import { format } from 'date-fns'

describe('Ripa Form Wrapper', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let wrapper
  let vuetify
  let stop
  const schoolsList = JSON.parse('[{"cdsCode":"1","fullName":"High School"}]')
  const countyCitiesList = JSON.parse('[{"id":"1","fullName":"CountyCity"}]')
  const nonCountyCitiesList = JSON.parse(
    '[{"id":"2","fullName":"NonCountyCity"}]',
  )
  const beatsList = JSON.parse('[{"id":"1","fullName":"Beat 1"}]')

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = (propsData, provideData) => {
    return mount(RipaFormWrapper, {
      localVue,
      store,
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        formStepIndex: computed(() => provideData?.formStepIndex ?? 0),
        lastReason: computed(() => null),
        isApiUnavailable() {
          return false
        },
        isOnlineAndAuthenticated() {
          return false
        },
        isAdmin: () => true,
        isAdminEditing: () => true,
        isAuthenticated: () => false,
        fullStop: () => {},
        displayDebugger: () => true,
        countyCities: computed(() => countyCitiesList),
        nonCountyCities: computed(() => nonCountyCitiesList),
        schools: computed(() => schoolsList),
        beats: computed(() => beatsList),
        statutes: computed(() => []),
        displayBeatInput: computed(() => true),
        ab2234Enabled: computed(() => false),
        ebikeCitationFollowupUrl: computed(() => ''),
      },
    })
  }

  const shallowFactory = (propsData, provideData) => {
    return shallowMount(RipaFormWrapper, {
      localVue,
      store,
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        formStepIndex: computed(() => provideData?.formStepIndex ?? 0),
        lastReason: computed(() => null),
        isApiUnavailable: () => false,
        isOnlineAndAuthenticated: () => false,
        isAdmin: () => true,
        isAdminEditing: () => true,
        isAuthenticated: () => false,
        fullStop: () => {},
        displayDebugger: () => true,
        countyCities: computed(() => countyCitiesList),
        nonCountyCities: computed(() => nonCountyCitiesList),
        schools: computed(() => schoolsList),
        beats: computed(() => beatsList),
        statutes: computed(() => []),
        displayBeatInput: computed(() => true),
        ab2234Enabled: computed(() => false),
        ebikeCitationFollowupUrl: computed(() => ''),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = shallowFactory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('submit-time stop date validation', () => {
    const stopWithDate = daysAgo => {
      const when = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      return {
        ...defaultStop(),
        stopDate: {
          ...defaultStop().stopDate,
          date: format(when, 'yyyy-MM-dd'),
          time: format(when, 'HH:mm'),
        },
      }
    }

    const submitFactory = ({ value, maxBackdateDays = 0, adminEditing }) => {
      const submitStore = new Vuex.Store({
        state: { apiConfig: { MaxBackdateDays: maxBackdateDays } },
      })

      return shallowMount(RipaFormWrapper, {
        localVue,
        store: submitStore,
        vuetify,
        propsData: { value },
        computed: { getApiStop: () => ({ stop: 'api' }) },
        provide: {
          formStepIndex: computed(() => 0),
          lastReason: computed(() => null),
          isApiUnavailable: () => false,
          isOnlineAndAuthenticated: () => false,
          isAdmin: () => false,
          isAdminEditing: adminEditing,
          isAuthenticated: () => false,
          fullStop: () => {},
          displayDebugger: () => false,
          countyCities: computed(() => countyCitiesList),
          nonCountyCities: computed(() => nonCountyCitiesList),
          schools: computed(() => schoolsList),
          beats: computed(() => beatsList),
          statutes: computed(() => []),
          displayBeatInput: computed(() => true),
          ab2234Enabled: computed(() => false),
          ebikeCitationFollowupUrl: computed(() => ''),
        },
      })
    }

    beforeEach(() => {
      window.scrollTo = jest.fn()
      jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('blocks a stale draft and sends the user back to step 1', async () => {
      wrapper = submitFactory({ value: stopWithDate(39), adminEditing: false })

      wrapper.vm.handleConfirmSubmit()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-submit-stop')).toBeUndefined()
      expect(wrapper.vm.stepIndex).toBe(1)
      expect(wrapper.vm.submissionDateError).toBe(
        'Date and Time must be within the past 24 hours',
      )
      expect(wrapper.emitted('on-step-index-change')[0]).toEqual([1])
    })

    it('blocks a stop older than the configured backdate window', () => {
      wrapper = submitFactory({
        value: stopWithDate(10),
        maxBackdateDays: 7,
        adminEditing: false,
      })

      wrapper.vm.handleConfirmSubmit()

      expect(wrapper.emitted('on-submit-stop')).toBeUndefined()
      expect(wrapper.vm.submissionDateError).toBe(
        'Date and Time cannot be more than 7 days in the past',
      )
    })

    it('submits a stop within the allowed window', () => {
      wrapper = submitFactory({ value: stopWithDate(0.5), adminEditing: false })

      wrapper.vm.handleConfirmSubmit()

      expect(wrapper.vm.submissionDateError).toBeNull()
      expect(wrapper.emitted('on-submit-stop')[0]).toEqual([{ stop: 'api' }])
    })

    it('does not re-validate the date when an admin is editing', () => {
      wrapper = submitFactory({ value: stopWithDate(39), adminEditing: true })

      wrapper.vm.handleConfirmSubmit()

      expect(wrapper.vm.submissionDateError).toBeNull()
      expect(wrapper.emitted('on-submit-stop')).toHaveLength(1)
    })
  })

  it.todo('should display non force actions for v2 stops')

  it.todo('should display actions taken for legacy stops')

  it.todo('should display force actions taken for v2 stops')

  it.todo('should not display force actions taken for legacy stops')

  it.skip('should reset reasonableSuspicion when changing reasonForStop', async () => {
    const updatedStop = createStartOfFormStepIndexThreeStop(stop)
    wrapper = factory({ value: updatedStop }, { formStepIndex: 3 })
    const expected = []

    for (let i = 1; i <= 6; i++) {
      if (i === 2) {
        continue
      }
      const selector = wrapper.findComponent(RipaSelect)
      selector.vm.model = 2
      await wrapper.vm.$nextTick()

      const checkGroup = wrapper.findComponent(RipaCheckGroup)
      checkGroup.vm.model = [1]

      selector.vm.model = i
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.stop.stopReason.reasonableSuspicion).toEqual(expected)
    }
  })
})

function createStartOfFormStepIndexThreeStop(stop) {
  return {
    ...stop,
    actionsTaken: {
      actionsTakenDuringStop: [],
      personSearchConsentGiven: false,
      propertySearchConsentGiven: false,
      basisForSearch: [],
      basisForSearchExplanation: null,
      basisForSearchPiiFound: false,
      propertyWasSeized: false,
      basisForPropertySeizure: [],
      typeOfPropertySeized: [],
      anyContraband: false,
      contrabandOrEvidenceDiscovered: [],
    },
    location: {
      blockNumber: '0',
      streetName: 'Anystreet',
      city: 'SAN DIEGO',
      beat: '009',
    },
    person: {
      anyDisabilities: false,
      isStudent: false,
      perceivedAge: 10,
      perceivedGender: 1,
      genderNonconforming: false,
      perceivedLimitedEnglish: false,
      perceivedLgbt: false,
      perceivedOrKnownDisability: [],
      perceivedRace: [1],
    },
    stopDate: {
      duration: 10,
      stopInResponseToCfs: false,
    },
    stopReason: {
      reasonForStop: null,
      educationViolation: null,
      educationViolationCode: null,
      trafficViolation: null,
      trafficViolationCode: null,
      reasonableSuspicion: [],
      reasonableSuspicionCode: null,
      searchOfPerson: null,
      reasonForStopExplanation: null,
      reasonForStopPiiFound: false,
    },
    stopResult: {
      resultsOfStop2: false,
      resultsOfStop3: false,
      resultsOfStop4: false,
      resultsOfStop5: false,
      resultsOfStop6: false,
      resultsOfStop7: false,
      resultsOfStop8: false,
      resultsOfStop9: false,
      resultsOfStop10: false,
      resultsOfStop11: false,
      resultsOfStop12: false,
      resultsOfStop13: false,
      warningCodes: [],
      citationCodes: [],
      infieldCodes: [],
      custodialArrestCodes: [],
    },
  }
}
