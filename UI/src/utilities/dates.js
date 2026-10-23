import differenceInHours from 'date-fns/differenceInHours'
import { differenceInYears as diffInYears } from 'date-fns'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import endOfDay from 'date-fns/endOfDay'

export const formatDate = dateStr => {
  if (dateStr && dateStr.length > 0) {
    const str = dateStr.replace(/-/g, '')
    const year = str.substring(0, 4)
    const month = str.substring(4, 6)
    const day = str.substring(6, 8)
    return `${year}-${month}-${day}`
  }

  return ''
}

export const isValidDate = dateStr => {
  const date = parseDate(dateStr, '00:00')
  return isValid(date)
}

const parseDate = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}`)
}

export const dateNotInFuture = (dateStr, timeStr) => {
  const date = parseDate(dateStr, timeStr || '00:00')
  return new Date().getTime() >= date.getTime()
}

export const differenceInYears = date => {
  const diff = diffInYears(new Date(), new Date(date))
  return diff
}

export const dateWithinLastHours = (dateStr, timeStr, hours) => {
  const date = parseDate(dateStr, timeStr)
  const diff = differenceInHours(new Date(), date)
  return diff < hours
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export const normalizeMaxBackdateDays = value => {
  const days = parseInt(value, 10)
  return isNaN(days) ? 0 : Math.min(Math.max(days, 0), 30)
}

// Returns an error message when the stop date/time may not be submitted under
// the configured backdate window, or null when it is acceptable.
export const getStopDateSubmissionError = (
  dateStr,
  timeStr,
  maxBackdateDays,
  lateSubmissionExplanation,
  now = new Date(),
) => {
  if (!dateStr || !timeStr) {
    return 'A stop date and time are required'
  }

  const days = normalizeMaxBackdateDays(maxBackdateDays)
  const diff = now.getTime() - parseDate(dateStr, timeStr).getTime()

  if (isNaN(diff)) {
    return 'The stop date and time are not valid'
  }

  if (diff < 0) {
    return 'Date and Time cannot be in the future'
  }

  if (days === 0) {
    return diff < MILLISECONDS_PER_DAY
      ? null
      : 'Date and Time must be within the past 24 hours'
  }

  if (diff > days * MILLISECONDS_PER_DAY) {
    return `Date and Time cannot be more than ${days} day${
      days === 1 ? '' : 's'
    } in the past`
  }

  if (
    diff > MILLISECONDS_PER_DAY &&
    !(lateSubmissionExplanation && lateSubmissionExplanation.length > 4)
  ) {
    return 'Explanation is required for stops submitted more than 24 hours after they occurred'
  }

  return null
}

export const formatDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}`)
}

export const formatShortDate = dateStr => {
  const date = parseDate(dateStr, '00:00')
  return format(new Date(date), 'yyyy-MM-dd')
}

export const uniqueId = () => {
  return format(new Date(), 'yyMMddkkmmss')
}

export const formatToIsoCurrentDate = () => {
  return format(endOfDay(new Date()), `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`)
}

export const formatToIsoDate = date => {
  return format(endOfDay(date), `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`)
}
