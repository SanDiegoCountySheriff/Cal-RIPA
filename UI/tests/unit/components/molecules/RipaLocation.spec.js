import RipaLocation from '@/components/molecules/RipaLocation.vue'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Location', () => {
  let vuetify
  let wrapper
  let stop

  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockReturnValue(200),
    watchPosition: jest.fn(),
  }

  global.navigator.geolocation = mockGeolocation

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

  const factory = propsData => {
    return mount(RipaLocation, {
      vuetify,
      propsData: {
        ...propsData,
        onOpenFavorites: jest.fn(),
        onOpenLastLocation: jest.fn(),
        onSaveFavorite: jest.fn(),
        onGpsLocation: jest.fn(),
      },
      provide: {
        loadingPiiStep1: computed(() => false),
        loadingGps: computed(() => false),
        isOnlineAndAuthenticated() {
          return true
        },
        beats: computed(() => beatsList),
        countyCities: computed(() => countyCitiesList),
        nonCountyCities: computed(() => nonCountyCitiesList),
        schools: computed(() => schoolsList),
        displayBeatInput() {
          return true
        },
        lastLocation() {
          return {}
        },
        validLastLocation: computed(() => true),
      },
    })
  }

  const schoolTestCases = [
    {
      school: null,
      expected: ['A school is required'],
    },
    {
      school: '1',
      expected: [true],
    },
  ]

  it('should match snapshot', () => {
    wrapper = mount(RipaLocation, {
      vuetify,
      propsData: {
        value: stop,
        onOpenFavorites: jest.fn(),
        onOpenLastLocation: jest.fn(),
        onSaveFavorite: jest.fn(),
        onGpsLocation: jest.fn(),
      },
      provide: {
        loadingPiiStep1: computed(() => false),
        loadingGps: computed(() => false),
        isOnlineAndAuthenticated() {
          return true
        },
        beats: computed(() => beatsList),
        countyCities: computed(() => countyCitiesList),
        nonCountyCities: computed(() => nonCountyCitiesList),
        schools: computed(() => schoolsList),
        displayBeatInput() {
          return true
        },
        lastLocation() {
          return {}
        },
        validLastLocation: computed(() => true),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  schoolTestCases.forEach(test => {
    it(`should validate school: ${test.school} as: ${test.expected}`, () => {
      wrapper = factory({
        value: stop,
        schools: schoolsList,
      })

      stop.location.isSchool = true
      stop.location.school = test.school
      wrapper.vm.model = stop

      expect(wrapper.vm.schoolRules).toEqual(test.expected)
    })
  })

  it('should validate block number', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.blockNumberRules).toEqual([
      'A block number is required',
      'Block number plus street name must be between 5 and 250 characters',
    ])

    stop.location.blockNumber = '1000'
    wrapper.vm.model = stop

    expect(wrapper.vm.blockNumberRules).toStrictEqual([true, true])
  })

  it('should validate street name', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRules).toEqual([
      'A street name is required',
      'Block number plus street name must be between 5 and 250 characters',
    ])

    stop.location.streetName = 'Anystreet St'
    wrapper.vm.model = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])
  })

  it('should validate intersection', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = ''
    wrapper.vm.model = stop

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = '5th and Main'
    wrapper.vm.model = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = null
    stop.location.blockNumber = '1000'
    stop.location.streetName = 'Anystreet St'
    wrapper.vm.model = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = '5th and Main'
    wrapper.vm.model = stop

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])
  })

  it('should validate highway', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.highwayRules).toEqual([
      'A highway and closest exit is required',
      'Highway and closest exit must be between 5 and 250 characters',
    ])

    stop.location.highwayExit = 'Exit 1A'
    wrapper.vm.model = stop

    expect(wrapper.vm.highwayRules).toStrictEqual([true, true])
  })

  it('should validate landmark', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.landmarkRules).toEqual([
      'A road marker, landmark, or other description is required',
      'Road marker, landmark or other description must be between 5 and 250 characters',
    ])

    stop.location.landmark = 'Exit 1A'
    wrapper.vm.model = stop

    expect(wrapper.vm.landmarkRules).toStrictEqual([true, true])
  })

  it('should validate latitude coordinate for v2 stop', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.latitudeRules).toEqual([
      'A valid latitude with a maximum of 3 digits after the decimal is required',
    ])

    stop.location.latitude = '-11.230'
    wrapper.vm.model = stop

    expect(wrapper.vm.latitudeRules).toStrictEqual([true])
  })

  it('should validate longitude coordinate for v2 stop', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.longitudeRules).toEqual([
      'A valid longitude with a maximum of 3 digits after the decimal is required',
    ])

    stop.location.longitude = '-11.230'
    wrapper.vm.model = stop

    expect(wrapper.vm.longitudeRules).toStrictEqual([true])
  })

  it('should return the geolocation score', () => {
    wrapper = factory({ value: stop })
    const getCurrPos = jest.spyOn(
      global.navigator.geolocation,
      'getCurrentPosition',
    )
    wrapper.vm.isGeolocationAvailable()

    expect(getCurrPos).toHaveBeenCalled()
  })

  it.todo('should handle input out of county')
  it.todo('should handle out of county toggle')
})
