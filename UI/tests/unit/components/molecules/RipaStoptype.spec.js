import RipaStopType from '@/components/molecules/RipaStopType'
import { shallowMount, mount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop'
import Vuetify from 'vuetify'

describe('Ripa Stop Type', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaStopType, {
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaStopType, {
      vuetify,
      propsData: {
        value: stop,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should reset insideResidence when setting to type other than pedestrian', () => {
    stop.person.insideResidence = true
    stop.stopType = 'Pedestrian'

    wrapper = factory({ value: stop })

    const updatedStop = stop
    updatedStop.stopType = 'Bicycle'
    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.model.person.insideResidence).toEqual(null)
  })

  it('should reset passengerInVehicle when setting to type other than vehicle', () => {
    stop.person.passengerInVehicle = true
    stop.stopType = 'Vehicular'

    wrapper = factory({ value: stop })

    const updatedStop = stop
    updatedStop.stopType = 'Pedestrian'
    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(wrapper.vm.model.person.passengerInVehicle).toEqual(null)
  })

  it('should reset non force actions taken 4 and 13 when setting to type other than vehicular', () => {
    stop.nonForceActionsTaken.nonForceActionsTakenDuringStop = [4, 13]
    stop.stopType = 'Vehicular'

    wrapper = factory({ value: stop })

    const updatedStop = stop
    updatedStop.stopType = 'Pedestrian'
    wrapper.vm.propsData = { value: updatedStop }
    wrapper.vm.handleInput()

    expect(
      wrapper.vm.model.nonForceActionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual([])
  })
})
