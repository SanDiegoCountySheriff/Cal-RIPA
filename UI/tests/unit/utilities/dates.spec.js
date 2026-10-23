import {
  getStopDateSubmissionError,
  normalizeMaxBackdateDays,
} from '@/utilities/dates'

describe('dates utilities', () => {
  const now = new Date('2026-10-01T12:00:00')

  describe('normalizeMaxBackdateDays', () => {
    it.each([
      [undefined, 0],
      [null, 0],
      ['abc', 0],
      [-3, 0],
      ['7', 7],
      [45, 30],
    ])('normalizes %p to %p', (input, expected) => {
      expect(normalizeMaxBackdateDays(input)).toBe(expected)
    })
  })

  describe('getStopDateSubmissionError', () => {
    it('requires a date and time', () => {
      expect(getStopDateSubmissionError(null, '10:00', 0, null, now)).toMatch(
        /required/,
      )
      expect(
        getStopDateSubmissionError('2026-10-01', null, 0, null, now),
      ).toMatch(/required/)
    })

    it('rejects future stops', () => {
      expect(
        getStopDateSubmissionError('2026-10-01', '13:00', 0, null, now),
      ).toBe('Date and Time cannot be in the future')
    })

    it('allows stops within 24 hours when backdating is disabled', () => {
      expect(
        getStopDateSubmissionError('2026-09-30', '13:00', 0, null, now),
      ).toBeNull()
    })

    it('rejects a draft started in August and submitted in October', () => {
      expect(
        getStopDateSubmissionError('2026-08-23', '12:16', 0, null, now),
      ).toBe('Date and Time must be within the past 24 hours')
    })

    it('rejects stops older than the configured backdate window', () => {
      expect(
        getStopDateSubmissionError('2026-09-20', '12:00', 7, 'Late entry', now),
      ).toBe('Date and Time cannot be more than 7 days in the past')
      expect(
        getStopDateSubmissionError('2026-09-29', '12:00', 1, 'Late entry', now),
      ).toBe('Date and Time cannot be more than 1 day in the past')
    })

    it('requires an explanation for stops older than 24 hours inside the window', () => {
      expect(
        getStopDateSubmissionError('2026-09-28', '12:00', 7, null, now),
      ).toMatch(/Explanation is required/)
      expect(
        getStopDateSubmissionError('2026-09-28', '12:00', 7, 'abc', now),
      ).toMatch(/Explanation is required/)
    })

    it('allows stops older than 24 hours inside the window with an explanation', () => {
      expect(
        getStopDateSubmissionError(
          '2026-09-28',
          '12:00',
          7,
          'Radio outage',
          now,
        ),
      ).toBeNull()
    })

    it('does not require an explanation within 24 hours when backdating is enabled', () => {
      expect(
        getStopDateSubmissionError('2026-09-30', '13:00', 7, null, now),
      ).toBeNull()
    })
  })
})
