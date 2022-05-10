import * as stop from '@/utilities/stop'

describe('stop', () => {
  it('should create a default stop', () => {
    const actual = stop.defaultStop()

    expect(actual.actionsTaken).toEqual({ anyActionsTaken: true })
    expect(actual.id).toEqual(0)
    expect(actual.person.index).toEqual(1)
  })

  it.todo('should get api stop person summary')

  it.todo('should get summary actions taken for legacy stops')

  it.todo('should get summary non-force actions taken for v2 stops')

  it.todo('should get actions taken for api stop to full stop for legacy stops')

  it.todo(
    'should get non-force actions taken for api stop to full stop for v2 stops',
  )

  it.todo('should get actions taken for full stop to stop for legacy stops')

  it.todo(
    'should get non-force actions taken for full stop to stop for v2 stops',
  )

  it.todo(
    'should get actions taken for api stop people listed for legacy stops',
  )

  it.todo(
    'should get non-force actions taken for api stop people listed for v2 stops',
  )
})
