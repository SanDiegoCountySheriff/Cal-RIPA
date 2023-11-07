import { shallowMount } from '@vue/test-utils'
import RipaInterval from '@/components/atoms/RipaInterval.vue'

describe('Ripa Interval', () => {
  jest.useFakeTimers()
  let wrapper = null

  const factory = propsData => {
    return shallowMount(RipaInterval, {
      propsData: {
        delay: 5000,
      },
    })
  }

  it('should emit tick', async () => {
    wrapper = factory()

    jest.advanceTimersByTime(5000)

    expect(wrapper.emitted('tick')).toBeTruthy()
  })

  it('should clear interval on destroy', () => {
    wrapper = factory()

    const clearInterval = jest.spyOn(window, 'clearInterval')
    jest.advanceTimersByTime(5000)

    wrapper.destroy()

    expect(clearInterval).toBeCalledTimes(1)
    expect(clearInterval).toHaveBeenCalledWith(1000000000001)
  })
})
