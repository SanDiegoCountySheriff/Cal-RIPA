import { STATUTES } from '@/constants/statutes'
import { STATUTES_V2 } from '../constants/statutes'

export const getStatuteContent = statute => {
  const parseStatute = statute.replace('§', '')
  const base = parseStatute.substring(0, 7)
  const sections = parseStatute.substring(7, parseStatute.length)
  const splitSections = sections.split(/[()]+/).filter(e => {
    return e
  })

  const statutes = version === 1 ? STATUTES : STATUTES_V2

  const level1 = splitSections.length > 0 ? splitSections[0] : null
  const level2 = splitSections.length > 1 ? splitSections[1] : null
  const level3 = splitSections.length > 2 ? splitSections[2] : null
  const level4 = splitSections.length > 3 ? splitSections[3] : null

  const [filteredStatute] = statutes.filter(item => item.statuteID === base)
  if (level1) {
    const [filteredLevel1] = filteredStatute.children.filter(
      item => item.id === level1,
    )
    if (level2) {
      const [filteredLevel2] = filteredLevel1.children.filter(
        item => item.id === level2,
      )
      if (level3) {
        const [filteredLevel3] = filteredLevel2.children.filter(
          item => item.id === level3,
        )
        if (level4) {
          const [filteredLevel4] = filteredLevel3.children.filter(
            item => item.id === level4,
          )
          return filteredLevel4
        } else {
          return filteredLevel3
        }
      } else {
        return filteredLevel2
      }
    } else {
      return filteredLevel1
    }
  }
  return null
}
