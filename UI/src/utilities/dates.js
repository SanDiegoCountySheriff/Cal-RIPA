import differenceInHours from 'date-fns/differenceInHours'
import { format } from 'date-fns'

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

export const dateNotInFuture = (dateStr, timeStr) => {
  const date = Date.parse(`${dateStr} ${timeStr}`)
  return new Date().getTime() >= new Date(date).getTime()
}

export const dateWithinLastHours = (dateStr, timeStr, hours) => {
  const date = Date.parse(`${dateStr} ${timeStr}`)
  const diff = differenceInHours(new Date(), new Date(date))
  return diff < hours
}

export const formatDateTime = (dateStr, timeStr) => {
  const date = Date.parse(`${dateStr} ${timeStr}`)
  return new Date(date)
}

export const uniqueId = () => {
  return format(new Date(), 'yyyyMMddkkmm')
}
