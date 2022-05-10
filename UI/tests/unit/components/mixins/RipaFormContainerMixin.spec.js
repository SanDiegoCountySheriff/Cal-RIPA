import RipaFormContainerMixin from '@/components/mixins/RipaFormContainerMixin'
import MockFormComponent from '../../mock/MockFormComponent'
import { shallowMount } from '@vue/test-utils'
import { STOP, V2_STOP } from '../../constants/RipaFormContainerTestConstants'

describe('Ripa Form Container Mixin', () => {
  let wrapper

  beforeEach(() => {
    const officer = {
      agency: 'SDSD',
      assignment: 1,
      officerId: '000000001',
      officerName: 'John Smith',
      officerRace: 'race',
      officerGender: 'gender',
      otherType: null,
      startDate: '2020-12-12',
      yearsExperience: 10,
    }
    localStorage.setItem('ripa_officer', JSON.stringify(officer))
  })

  const factory = propsData => {
    return shallowMount(MockFormComponent, {
      propsData: {
        ...propsData,
      },
      mixins: [RipaFormContainerMixin],
      computed: {
        mappedFormStatutes: jest.fn().mockReturnValue([
          {
            code: 0,
            fullName: 'Statute 0',
          },
          {
            code: 1,
            fullName: 'Statute 1',
          },
        ]),
        mappedFormBeats: jest.fn().mockReturnValue([
          {
            id: 0,
            fullName: 'Beat 0',
          },
          {
            id: 1,
            fullName: 'Beat 1',
          },
        ]),
        mappedFormCountyCities: jest.fn().mockReturnValue([
          {
            id: 0,
            fullName: 'City 0',
          },
          {
            id: 1,
            fullName: 'City 1',
          },
        ]),
      },
    })
  }

  it('should handle input', () => {
    wrapper = factory()
    const updateFullStop = jest.spyOn(wrapper.vm, 'updateFullStop')

    wrapper.vm.handleInput({ newVal: 'newVal' })

    expect(wrapper.vm.stop).toEqual({ newVal: 'newVal' })
    expect(updateFullStop).toHaveBeenCalled()
  })

  it('should update full stop for legacy stops', () => {
    wrapper = factory()
    wrapper.vm.stop = STOP

    wrapper.vm.updateFullStop()

    expect(
      wrapper.vm.fullStop.people[0].actionsTaken.actionsTakenDuringStop,
    ).toEqual([])
    expect(
      wrapper.vm.fullStop.people[0].actionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual(undefined)
  })

  it('should update full stop for v2 stops', () => {
    wrapper = factory()
    wrapper.vm.stop = V2_STOP

    wrapper.vm.updateFullStop()

    expect(
      wrapper.vm.fullStop.people[0].actionsTaken.actionsTakenDuringStop,
    ).toEqual(undefined)
    expect(
      wrapper.vm.fullStop.people[0].actionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual([])
  })
})
