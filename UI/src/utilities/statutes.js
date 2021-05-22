import { STATUTES } from '@/constants/statutes'

export const getStatuteContent = statute => {
  const parseStatute = statute.replace('§', '')
  const base = parseStatute.substring(0, 7)
  const sections = parseStatute.substring(7, parseStatute.length)
  const splitSections = sections.split(/[()]+/).filter(e => {
    return e
  })

  const level1 = splitSections.length > 0 ? splitSections[0] : null
  const level2 = splitSections.length > 1 ? splitSections[1] : null
  const level3 = splitSections.length > 2 ? splitSections[2] : null
  const level4 = splitSections.length > 3 ? splitSections[3] : null

  const [filteredStatute] = STATUTES.filter(item => item.statuteID === base)
  if (level1) {
    const [filteredLevel1] = filteredStatute.level1.filter(
      item => item.id === level1,
    )
    if (level2) {
      const [filteredLevel2] = filteredLevel1.level2.filter(
        item => item.id === level2,
      )
      if (level3) {
        const [filteredLevel3] = filteredLevel2.level3.filter(
          item => item.id === level3,
        )
        if (level4) {
          const [filteredLevel4] = filteredLevel3.level4.filter(
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
