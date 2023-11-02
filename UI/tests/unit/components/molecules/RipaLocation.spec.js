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
        favoriteLocations: computed(() => []),
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
        favoriteLocations: computed(() => []),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  schoolTestCases.forEach(test => {
    it(`should validate school: ${test.school} as: ${test.expected}`, () => {
      stop.location.isSchool = true
      stop.location.school = test.school
      wrapper = factory({
        value: stop,
        schools: schoolsList,
      })

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
    stop.location.streetName = 'Test'

    expect(wrapper.vm.blockNumberRules).toStrictEqual([true, true])
  })

  it('should validate V2 block number', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.blockNumberRulesV2).toEqual([
      'A block number is required',
      'Block number must be between 1 and 8 characters',
    ])

    stop.location.blockNumber = '12'
    stop.location.streetName = 'V2 Test'

    expect(wrapper.vm.blockNumberRulesV2).toStrictEqual([true, true])
  })

  it('should validate street name', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRules).toEqual([
      'A street name is required',
      'Block number plus street name must be between 5 and 250 characters',
    ])

    stop.location.streetName = 'Anystreet St'

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])
  })

  it('should validate V2 street name', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.streetNameRulesV2).toEqual([
      'A street name is required',
      'Street name must be between 1 and 50 characters',
    ])

    stop.location.streetName = 'Anystreet St'

    expect(wrapper.vm.streetNameRulesV2).toStrictEqual([true, true])
  })

  it('should validate intersection', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = ''

    expect(wrapper.vm.intersectionRules).toEqual([
      'An intersection is required',
      'Intersection must be between 5 and 250 characters',
    ])

    stop.location.intersection = '5th and Main'

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = null
    stop.location.blockNumber = '1000'
    stop.location.streetName = 'Anystreet St'

    expect(wrapper.vm.streetNameRules).toStrictEqual([true, true])

    stop.location.intersection = '5th and Main'

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

    expect(wrapper.vm.highwayRules).toStrictEqual([true, true])
  })

  it('should validate highway V2', () => {
    stop.location.toggleLocationOptions = true
    wrapper = factory({ value: stop })

    expect(wrapper.vm.highwayRulesV2).toEqual([
      'Must fill out both highway and exit in order to use highway and exit',
      'Highway must be between 1 and 75 characters',
      'Closest exit must be between 1 and 50 characters',
    ])

    const updatedStop = stop

    updatedStop.location.highway = 'Valid Highway'
    updatedStop.location.exit = ''

    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.highwayRulesV2).toEqual([
      'Must fill out both highway and exit in order to use highway and exit',
      true,
      'Closest exit must be between 1 and 50 characters',
    ])

    updatedStop.location.exit = 'Valid Exit'
    updatedStop.location.highway = ''

    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.highwayRulesV2).toEqual([
      'Must fill out both highway and exit in order to use highway and exit',
      'Highway must be between 1 and 75 characters',
      true,
    ])

    updatedStop.location.exit = 'x'.repeat(51)
    updatedStop.location.highway = 'Valid Highway'

    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.highwayRulesV2).toEqual([
      true,
      true,
      'Closest exit must be between 1 and 50 characters',
    ])

    updatedStop.location.highway = 'x'.repeat(76)
    updatedStop.location.exit = 'Valid Exit'

    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.highwayRulesV2).toEqual([
      true,
      'Highway must be between 1 and 75 characters',
      true,
    ])

    updatedStop.location.highway = 'Highway'
    updatedStop.location.exit = 'Exit'
    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.highwayRulesV2).toStrictEqual([true, true, true])
  })

  it.skip('should validate exit V2', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.highwayRulesV2).toEqual([
      'Must fill out both highway and exit in order to use highway and exit',
      'Highway must be between 1 and 75 characters',
      'Closest exit must be between 1 and 50 characters',
    ])

    stop.location.exit = 'Exit'
    wrapper.vm.model = stop

    expect(wrapper.vm.highwayRulesV2).toStrictEqual([true, true])
  })

  it('should validate landmark', () => {
    wrapper = factory({ value: stop })
    stop.location.toggleLocationOptions = true
    expect(wrapper.vm.landmarkRules).toEqual([
      'A road marker, landmark, or other description is required',
      'Road marker, landmark or other description must be between 5 and 250 characters',
    ])

    stop.location.landmark = 'Exit 1A'

    expect(wrapper.vm.landmarkRules).toStrictEqual([true, true])
  })

  it('should validate V2 landmark', () => {
    stop.location.toggleLocationOptions = true
    wrapper = factory({ value: stop })
    expect(wrapper.vm.landmarkRulesV2).toEqual([
      'A road marker, landmark, or other description is required',
      'Road marker, landmark or other description must be between 5 and 150 characters',
    ])

    stop.location.landmark = 'Exit 1A'

    expect(wrapper.vm.landmarkRulesV2).toStrictEqual([true, true])
  })

  it('should validate latitude coordinate for v2 stop', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.latitudeRules[0]('')).toEqual('Latitude is required')
    expect(wrapper.vm.latitudeRules[1]('')).toEqual(true)
    expect(wrapper.vm.latitudeRules[0]('-11.230')).toEqual(true)
    expect(wrapper.vm.latitudeRules[1]('-11.230')).toEqual(
      'A valid latitude with a maximum of 3 digits after the decimal is required',
    )
    expect(wrapper.vm.latitudeRules[0]('11.2301')).toEqual(true)
    expect(wrapper.vm.latitudeRules[1]('11.2301')).toEqual(
      'A valid latitude with a maximum of 3 digits after the decimal is required',
    )
    expect(wrapper.vm.latitudeRules[0]('11.230')).toEqual(true)
    expect(wrapper.vm.latitudeRules[1]('11.230')).toEqual(true)
  })

  it('should validate longitude coordinate for v2 stop', () => {
    wrapper = factory({ value: stop })

    expect(wrapper.vm.longitudeRules[0]('')).toEqual('Longitude is required')
    expect(wrapper.vm.longitudeRules[1]('')).toEqual(true)
    expect(wrapper.vm.longitudeRules[0]('123.123')).toEqual(true)
    expect(wrapper.vm.longitudeRules[1]('123.123')).toEqual(
      'A valid negative longitude with a maximum of 3 digits after the decimal is required',
    )
    expect(wrapper.vm.longitudeRules[0]('-123.1231')).toEqual(true)
    expect(wrapper.vm.longitudeRules[1]('-123.1231')).toEqual(
      'A valid negative longitude with a maximum of 3 digits after the decimal is required',
    )
    expect(wrapper.vm.longitudeRules[0]('-123.123')).toEqual(true)
    expect(wrapper.vm.longitudeRules[1]('-123.123')).toEqual(true)
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
