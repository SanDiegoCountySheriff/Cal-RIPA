import RipaFormWrapper from '@/components/organisms/RipaFormWrapper.vue'
import RipaSelect from '@/components/atoms/RipaSelect.vue'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup.vue'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import store from '@/store'
import { computed } from 'vue'

describe('Ripa Form Wrapper', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let wrapper
  let vuetify
  let stop

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
        statutes: [{ id: 'test' }],
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
        countyCities: computed(() => []),
        beats: computed(() => []),
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
        countyCities: computed(() => []),
        beats: computed(() => []),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = shallowFactory({ value: stop })

    expect(wrapper.html()).toMatchSnapshot()
  })

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
