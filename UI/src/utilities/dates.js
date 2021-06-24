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

export const formatDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}`)
}

export const formatShortDate = dateStr => {
  const date = parseDate(dateStr, '00:00')
  return format(new Date(date), 'yyyy-MM-dd')
}

export const uniqueId = () => {
  return format(new Date(), 'yyyyMMddkkmm')
}

export const formatToIsoCurrentDate = () => {
  return format(endOfDay(new Date()), `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`)
}

export const formatToIsoDate = date => {
  return format(endOfDay(date), `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`)
}
