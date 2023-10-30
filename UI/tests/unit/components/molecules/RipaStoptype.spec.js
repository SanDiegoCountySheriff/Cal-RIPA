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

  it('should set model', () => {
    wrapper = factory({ value: stop })

    wrapper.vm.model = { test: 'test', person: { insideResidence: true } }

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        test: 'test',
        person: { insideResidence: null, passengerInVehicle: null },
      },
    ])
  })

  it('should reset insideResidence when setting to type other than pedestrian', async () => {
    const updatedStop = stop
    updatedStop.person.insideResidence = true
    updatedStop.stopType = 'Pedestrian'

    wrapper = factory({ value: updatedStop })

    wrapper.vm.model.stopType = 'Bicycle'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.model.person.insideResidence).toEqual(null)
  })

  it('should reset passengerInVehicle when setting to type other than vehicle', async () => {
    const updatedStop = stop
    updatedStop.person.passengerInVehicle = true
    updatedStop.stopType = 'Vehicular'

    wrapper = factory({ value: updatedStop })

    wrapper.vm.model.stopType = 'Pedestrian'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.model.person.passengerInVehicle).toEqual(null)
  })

  it.todo('should watch model')
})
