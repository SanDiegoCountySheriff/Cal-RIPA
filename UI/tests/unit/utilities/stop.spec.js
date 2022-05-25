import * as stop from '@/utilities/stop'
import {
  API_STOP,
  V2_API_STOP,
  FULL_STOP,
  V2_FULL_STOP,
} from '../constants/RipaFormContainerTestConstants'

describe('stop', () => {
  it('should create a default stop', () => {
    const actual = stop.defaultStop()

    expect(actual.actionsTaken).toEqual({ anyNonForceActionsTaken: true })
    expect(actual.id).toEqual(0)
    expect(actual.person.index).toEqual(1)
  })

  it('should get api stop person summary actions taken for legacy stops', () => {
    const actual = stop.apiStopPersonSummary(API_STOP, '1')
    const expected = {
      id: 'B12',
      content: {
        level: 2,
        header: 'Actions Taken During Stop',
        children: [{ detail: 'None' }],
      },
    }

    expect(actual.filter(item => item.id === 'B12')[0]).toEqual(expected)
  })

  it('should get api stop person summary non-force actions taken for v2 stops', () => {
    const actual = stop.apiStopPersonSummary(V2_API_STOP, '1')
    const expected = {
      id: 'B12',
      content: {
        level: 2,
        header: 'Non-Force Actions Taken During Stop',
        children: [{ detail: 'None' }],
      },
    }

    expect(actual.filter(item => item.id === 'B12')[0]).toEqual(expected)
  })

  it('should get api stop people listed actions taken for legacy stops', () => {
    const actual = stop.getApiStopPeopleListed(FULL_STOP, [
      { id: '1', code: 'Statute 1' },
      { id: '2', code: 'Statute 2' },
    ])
    const expected = [{ key: '24', action: 'None' }]

    expect(actual[0].listActionTakenDuringStop).toEqual(expected)
    expect(actual[0].listNonForceActionTakenDuringStop).toEqual(null)
  })

  it('should get api stop people listed actions taken for legacy stops admin edit', () => {
    const actual = stop.getApiStopPeopleListed(FULL_STOP, [
      { id: '1', code: 'Statute 1' },
      { id: '2', code: 'Statute 2' },
    ])
    const expected = [{ key: '24', action: 'None' }]

    expect(actual[0].listActionTakenDuringStop).toEqual(expected)
    expect(actual[0].listNonForceActionTakenDuringStop).toEqual(null)
  })

  it('should get api stop people listed non-force actions taken for v2 stops', () => {
    const actual = stop.getApiStopPeopleListed(V2_FULL_STOP, [
      { id: '1', code: 'Statute 1' },
      { id: '2', code: 'Statute 2' },
    ])
    const expected = [{ key: '18', action: 'None' }]

    expect(actual[0].listActionTakenDuringStop).toEqual(null)
    expect(actual[0].listNonForceActionTakenDuringStop).toEqual(expected)
  })

  it('should get api stop people listed non-force actions taken for v2 stops admin edit', () => {
    const actual = stop.getApiStopPeopleListed(V2_FULL_STOP, [
      { id: '1', code: 'Statute 1' },
      { id: '2', code: 'Statute 2' },
    ])
    const expected = [{ key: '18', action: 'None' }]

    expect(actual[0].listActionTakenDuringStop).toEqual(null)
    expect(actual[0].listNonForceActionTakenDuringStop).toEqual(expected)
  })
})
