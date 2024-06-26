import { formatDate } from '@/utilities/dates'
import { beats } from './beats'
import { cities } from './cities'
import { schools } from './schools'
import { statutes } from './statutes'
import { users } from './users'
import { favorites } from './favorites'
import { questions } from './questions'

export const adminBeats = () => {
  return beats.sort((x, y) => {
    const beatA = x.command.toUpperCase()
    const beatB = y.command.toUpperCase()
    return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
  })
}

export const adminCities = () => {
  return cities
    .sort((x, y) => {
      const cityA = x.name.toUpperCase()
      const cityB = y.name.toUpperCase()
      return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
    })
    .map(item => {
      return {
        ...item,
        deactivationDate: formatDate(item.deactivationDate),
      }
    })
}

export const adminSchools = () => {
  return schools
    .sort((x, y) => {
      const schoolA = x.name.toUpperCase()
      const schoolB = y.name.toUpperCase()
      return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
    })
    .map(item => {
      return {
        ...item,
        county: item.county ? item.county.toUpperCase() : '',
        district: item.district ? item.district.toUpperCase() : '',
        name: item.name ? item.name.toUpperCase() : '',
        status: item.status ? item.status.toUpperCase() : '',
      }
    })
}

export const adminStatutes = () => {
  return statutes.map(item => {
    return {
      ...item,
      code: item.offenseCode,
      offenseEnacted: formatDate(item.offenseEnacted),
      offenseRepealed: formatDate(item.offenseRepealed),
    }
  })
}

export const adminUsers = () => {
  return users
    .sort((x, y) => {
      const userA = x.lastName.toUpperCase()
      const userB = y.lastName.toUpperCase()
      return userA < userB ? -1 : userA > userB ? 1 : 0
    })
    .map(item => {
      return {
        ...item,
        name: `${item.firstName} ${item.lastName}`,
      }
    })
}

export const formBeats = () => {
  return beats
    .sort((x, y) => {
      const beatA = x.command.toUpperCase()
      const beatB = y.command.toUpperCase()
      return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
    })
    .map(item => {
      return {
        id: item.id,
        fullName: `${item.command} ${item.id}`,
      }
    })
}

export const formCountyCities = () => {
  return cities
    .filter(item => item.county === 'SAN DIEGO')
    .sort((x, y) => {
      const cityA = x.name.toUpperCase()
      const cityB = y.name.toUpperCase()
      return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
    })
    .map(item => {
      return {
        id: item.name.toUpperCase(),
        fullName: item.name.toUpperCase(),
      }
    })
}

export const formNonCountyCities = () => {
  return cities
    .filter(item => item.county !== 'SAN DIEGO')
    .sort((x, y) => {
      const cityA = x.name.toUpperCase()
      const cityB = y.name.toUpperCase()
      return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
    })
    .map(item => {
      return {
        id: item.name.toUpperCase(),
        fullName: item.name.toUpperCase(),
      }
    })
}

export const formSchools = () => {
  return schools
    .filter(item => item.status === 'Active')
    .sort((x, y) => {
      const schoolA = x.name.toUpperCase()
      const schoolB = y.name.toUpperCase()
      return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
    })
    .map(item => {
      return {
        cdsCode: item.cdsCode,
        fullName: `${item.name.toUpperCase()} (${item.district.toUpperCase()}) ${
          item.cdsCode
        }`,
      }
    })
}

export const formStatutes = () => {
  return statutes
    .filter(item => item.offenseRepealed === null)
    .map(item => {
      return {
        code: item.offenseCode,
        description: `${item.offenseStatute} ${item.statuteLiteral} (${item.offenseTypeOfCharge})`,
      }
    })
    .map(item => {
      return {
        code: item.code,
        fullName: `${item.description} ${item.code}`,
      }
    })
}

export const favoriteLocations = () => {
  return favorites.sort((x, y) => {
    const favA = x.name.toUpperCase()
    const favB = y.name.toUpperCase()
    return favA < favB ? -1 : favA > favB ? 1 : 0
  })
}

export const agencyQuestions = () => {
  return questions
}
