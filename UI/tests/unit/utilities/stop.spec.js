import { defaultStop } from '@/utilities/stop'

const stop = defaultStop()

describe('stop', () => {
  it('should create a default stop', () => {
    const actual = defaultStop()

    expect(actual).toEqual(stop)
  })
})
