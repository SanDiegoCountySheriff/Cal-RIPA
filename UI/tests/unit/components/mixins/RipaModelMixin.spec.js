import MockModelComponent from '../../mock/MockModelComponent'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import { shallowMount } from '@vue/test-utils'
import { defaultStop } from '@/utilities/stop.js'

describe('Ripa Model Mixin', () => {
  let wrapper
  let stop

  beforeEach(() => {
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(MockModelComponent, {
      propsData: {
        ...propsData,
      },
      mixins: [RipaModelMixin],
    })
  }

  it.todo('should sync model')

  it.todo('should update model')

  it('should update non force actions taken model', () => {
    stop.actionsTaken.nonForceActionsTakenDuringStop = [16, 17]
    stop.actionsTaken.anyActionsTaken = true
    wrapper = factory({ value: stop })

    wrapper.vm.updateNonForceActionsTakenModel()

    expect(
      wrapper.vm.viewModel.actionsTaken.nonForceActionsTakenDuringStop,
    ).toEqual([16])
  })

  it.todo('should update non force actions taken search model')

  it.todo('should update basis for search model')

  it.todo('should update property was seized model')

  it.todo('should remove actions taken person search')

  it.todo('should remove actions taken property search')

  it.todo('should update stop reason search model')
})
