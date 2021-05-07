import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { formatDateTime } from '@/utilities/dates'
import {
  OFFICER_ASSIGNMENTS,
  DURATIONS,
  RACES,
  GENDERS,
  AGES,
  DISABILITIES,
  STOP_REASONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  CONTRABAND_TYPES,
  STOP_RESULTS,
} from '@/constants/form'

export const defaultStop = () => {
  return {
    id: uuidv4(),
    created: new Date(),
    person: {
      id: new Date().getTime(),
    },
  }
}

export const motorStop = () => {
  return {
    id: uuidv4(),
    created: new Date(),
    officer: {
      editOfficer: false,
      yearsExperience: this.getOfficerYearsExperience(),
      assignment: this.getOfficerAssignment(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm'),
    },
    person: {
      id: new Date().getTime(),
    },
    stopReason: {
      reasonForStop: 1,
      trafficViolation: 1,
      trafficViolationCode: 54106,
      reasonForStopExplanation: 'Speeding',
    },
    actionsTaken: {},
    stopResult: {
      anyActionsTaken: true,
      actionsTakenDuringStop1: false,
      actionsTakenDuringStop2: true,
      actionsTakenDuringStop3: false,
      actionsTakenDuringStop4: false,
      actionsTakenDuringStop5: false,
      actionsTakenDuringStop6: false,
      actionsTakenDuringStop7: false,
      actionsTakenDuringStop8: false,
      actionsTakenDuringStop9: false,
      actionsTakenDuringStop10: false,
      warningCodes: [],
      citationCodes: [54106],
      infieldCodes: [],
      custodialArrestCodes: [],
    },
  }
}

export const probationStop = () => {
  return {
    id: uuidv4(),
    created: new Date(),
    officer: {
      editOfficer: false,
      yearsExperience: this.getOfficerYearsExperience(),
      assignment: this.getOfficerAssignment(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm'),
    },
    person: {
      id: new Date().getTime(),
    },
    stopReason: {
      reasonForStop: 3,
      reasonForStopExplanation:
        'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
    },
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
  }
}

export const longFullStop = (
  fullStop,
  beats,
  countyCities,
  nonCountyCities,
  schools,
  statutes,
) => {
  return {
    id: fullStop.id,
    piiFound: getPiiFound(fullStop),
    created: fullStop.created || new Date(),
    updated: fullStop.updated || new Date(),
    officer: {
      editOfficer: fullStop.officer?.editOfficer || false,
      yearsExperience: fullStop.officer?.yearsExperience || null,
      assignment: getOfficerAssignment(fullStop),
      otherType: stop.officer?.otherType || null,
    },
    stopDate: {
      date: fullStop.stopDate.date,
      time: fullStop.stopDate.time,
      dateTime: formatDateTime(fullStop.stopDate.date, fullStop.stopDate.time),
      duration: getDuration(fullStop),
      stopInResponseToCfs: fullStop.stopDate?.stopInResponseToCfs || false,
    },
    location: {
      isSchool: fullStop.location?.isSchool || false,
      school: getSchool(fullStop, schools),
      blockNumber: fullStop.location?.blockNumber || null,
      streetName: fullStop.location?.streetName || null,
      intersection: fullStop.location?.intersection || null,
      moreLocationOptions: fullStop.location?.moreLocationOptions || false,
      highwayExit: fullStop.location?.highwayExit || null,
      landmark: fullStop.location?.landmark || null,
      outOfCounty: fullStop.location?.outOfCounty || false,
      city: getCity(
        fullStop,
        fullStop.location.outOfCounty ? nonCountyCities : countyCities,
      ),
      beat: getBeat(fullStop, beats),
    },
    people: getPeople(fullStop, statutes),
  }
}

const getPiiFound = fullStop => {
  const people = fullStop.people || []
  let reasonForStopPiiFound = false
  let basisForSearchPiiFound = false

  for (let index = 0; index < people.length; index++) {
    const person = people[index]
    if (!reasonForStopPiiFound && !basisForSearchPiiFound) {
      reasonForStopPiiFound = person.stopReason?.reasonForStopPiiFound || false
      basisForSearchPiiFound =
        person.actionsTaken?.basisForSearchPiiFound || false
    }
  }

  return reasonForStopPiiFound || basisForSearchPiiFound
}

const getOfficerAssignment = fullStop => {
  const assignment = fullStop.officer?.assignment || null
  if (assignment) {
    return {
      key: assignment,
      text: assignment ? OFFICER_ASSIGNMENTS[assignment - 1].name : 'N/A',
    }
  }

  return null
}

const getDuration = fullStop => {
  const duration = fullStop.stopDate?.duration || null
  if (duration) {
    return {
      key: duration,
      text: duration ? DURATIONS[duration - 1].name : 'N/A',
    }
  }

  return null
}

const getSchool = (fullStop, schools) => {
  const school = fullStop.location?.school || null

  if (school) {
    const [filteredSchool] = schools.filter(item => item.cdsCode === school)
    return {
      key: school,
      text: filteredSchool ? filteredSchool.fullName : 'N/A',
    }
  }

  return null
}

const getCity = (fullStop, cities) => {
  const city = fullStop.location?.city || null

  if (city) {
    const [filteredCity] = cities.filter(item => item.id === city)
    return {
      key: city,
      text: filteredCity ? filteredCity.fullName : 'N/A',
    }
  }

  return null
}

const getBeat = (fullStop, beats) => {
  const beat = fullStop.location?.beat || null

  if (beat) {
    const [filteredBeat] = beats.filter(item => item.id === beat)
    return {
      key: beat,
      text: filteredBeat ? filteredBeat.fullName : 'N/A',
    }
  }

  return null
}

const getPeople = (fullStop, statutes) => {
  return fullStop.people.map(person => {
    return {
      person: {
        id: person.id,
        isStudent: person.isStudent || false,
        perceivedRace: getPerceivedRace(person),
        perceivedGender: getPerceivedGender(person),
        perceivedLgbt: person.perceivedLgbt || false,
        perceivedAge: getPerceivedAge(person),
        perceivedOrKnownDisability: getPerceivedOrKnownDisability(person),
      },
      stopReason: {
        reasonForStop: getReasonForStop(person),
        trafficViolation: getTrafficViolation(person),
        trafficViolationCode: getTrafficViolationCode(person, statutes),
        reasonableSuspicion: getReasonableSuspicion(person),
        reasonableSuspicionCode: getReasonableSuspicionCode(person, statutes),
        searchOfPerson: person.stopReason?.searchOfPerson || false,
        searchOfProperty: person.stopReason?.searchOfProperty || false,
        reasonForStopExplanation:
          person.stopReason?.reasonForStopExplanation || null,
        reasonForStopPiiFound:
          person.stopReason?.reasonForStopPiiFound || false,
      },
      actionsTaken: {
        anyActionsTaken: person.actionsTaken?.anyActionsTaken || false,
        actionsTakenDuringStop: getActionsTakenDuringStop(person),
        personSearchConsentGiven:
          person.actionsTaken?.personSearchConsentGiven || false,
        propertySearchConsentGiven:
          person.actionsTaken?.propertySearchConsentGiven || false,
        basisForSearch: getBasisForSearch(person),
        basisForSearchExplanation:
          person.actionsTaken?.basisForSearchExplanation || null,
        basisForSearchPiiFound:
          person.actionsTaken?.basisForSearchPiiFound || false,
        propertyWasSeized: person.actionsTaken?.propertyWasSeized || false,
        basisForPropertySeizure: getBasisForPropertySeizure(person),
        typeOfPropertySeized: getTypeOfPropertySeized(person),
        anyContraband: person.actionsTaken?.anyContraband || false,
        contrabandOrEvidenceDiscovered: getContrabandOrEvidenceDiscovered(
          person,
        ),
      },
      stopResult: {
        anyActionsTaken: person.stopResult?.anyActionsTaken || false,
        actionsTakenDuringStop: getStopResultActionsTakenDuringStop(person),
        warningCodes: getWarningCodes(person, statutes),
        citationCodes: getCitationCodes(person, statutes),
        infieldCodes: getInfieldCodes(person, statutes),
        custodialArrestCodes: getCustodialArrestCodes(person, statutes),
      },
    }
  })
}

const getPerceivedRace = person => {
  const race = person.perceivedRace || []

  return race.map(item => {
    return {
      key: item,
      value: RACES[item - 1].name,
    }
  })
}

const getPerceivedGender = person => {
  const gender = person.perceivedGender || null
  if (gender) {
    return {
      key: gender,
      text: gender ? GENDERS[gender - 1].name : 'N/A',
    }
  }

  return null
}

const getPerceivedAge = person => {
  const age = person.perceivedAge || null
  if (age) {
    return {
      key: age,
      text: age ? AGES[age - 1].name : 'N/A',
    }
  }

  return null
}

const getPerceivedOrKnownDisability = person => {
  const disability = person.perceivedOrKnownDisability || []

  return disability.map(item => {
    return {
      key: item,
      value: DISABILITIES[item - 1].name,
    }
  })
}

const getReasonForStop = person => {
  const reason = person.stopReason?.reasonForStop || null

  if (reason) {
    return {
      key: reason,
      text: reason ? STOP_REASONS[reason - 1].name : 'N/A',
    }
  }

  return null
}

const getTrafficViolation = person => {
  const violation = person.stopReason?.trafficViolation || null
  if (violation) {
    return {
      key: violation,
      text: violation ? TRAFFIC_VIOLATIONS[violation - 1].name : 'N/A',
    }
  }

  return null
}

const getStatute = (code, statutes) => {
  if (code) {
    const [filteredStatute] = statutes.filter(item => item.code === code)
    return {
      key: code,
      text: filteredStatute ? filteredStatute.fullName : 'N/A',
    }
  }

  return null
}

const getTrafficViolationCode = (person, statutes) => {
  const code = person.stopReason?.trafficViolationCode || null
  if (code) {
    return getStatute(code, statutes)
  }

  return null
}

const getReasonableSuspicion = person => {
  const suspicion = person.reasonableSuspicion || []

  return suspicion.map(item => {
    return {
      key: item,
      value: REASONABLE_SUSPICIONS[item - 1].name,
    }
  })
}

const getReasonableSuspicionCode = (person, statutes) => {
  const code = person.stopReason?.reasonableSuspicionCode || null
  if (code) {
    return getStatute(code, statutes)
  }

  return null
}

const getActionsTakenDuringStop = person => {
  const actions = person.actionsTaken?.actionsTakenDuringStop || []

  return actions.map(item => {
    return {
      key: item,
      value: ACTIONS_TAKEN[item - 1].name,
    }
  })
}

const getBasisForSearch = person => {
  const basis = person.actionsTaken?.basisForSearch || []

  return basis.map(item => {
    return {
      key: item,
      value: BASIS_FOR_SEARCH[item - 1].name,
    }
  })
}

const getBasisForPropertySeizure = person => {
  const basis = person.actionsTaken?.basisForPropertySeizure || []

  return basis.map(item => {
    return {
      key: item,
      value: BASIS_FOR_PROPERTY_SEIZURE[item - 1].name,
    }
  })
}

const getTypeOfPropertySeized = person => {
  const types = person.actionsTaken?.typeOfPropertySeized || []

  return types.map(item => {
    return {
      key: item,
      value: CONTRABAND_TYPES[item - 1].name,
    }
  })
}

const getContrabandOrEvidenceDiscovered = person => {
  const types = person.actionsTaken?.contrabandOrEvidenceDiscovered || []

  return types.map(item => {
    return {
      key: item,
      value: CONTRABAND_TYPES[item - 1].name,
    }
  })
}

const getStopResultActionsTakenDuringStop = person => {
  const types = []
  const actionsTakenDuringStop1 =
    person.stopResult?.actionsTakenDuringStop1 || false
  const actionsTakenDuringStop2 =
    person.stopResult?.actionsTakenDuringStop2 || false
  const actionsTakenDuringStop3 =
    person.stopResult?.actionsTakenDuringStop3 || false
  const actionsTakenDuringStop4 =
    person.stopResult?.actionsTakenDuringStop4 || false
  const actionsTakenDuringStop5 =
    person.stopResult?.actionsTakenDuringStop5 || false
  const actionsTakenDuringStop6 =
    person.stopResult?.actionsTakenDuringStop6 || false
  const actionsTakenDuringStop7 =
    person.stopResult?.actionsTakenDuringStop7 || false
  const actionsTakenDuringStop8 =
    person.stopResult?.actionsTakenDuringStop8 || false
  const actionsTakenDuringStop9 =
    person.stopResult?.actionsTakenDuringStop9 || false
  const actionsTakenDuringStop10 =
    person.stopResult?.actionsTakenDuringStop10 || false

  if (actionsTakenDuringStop1) {
    types.push(1)
  }
  if (actionsTakenDuringStop2) {
    types.push(2)
  }
  if (actionsTakenDuringStop3) {
    types.push(3)
  }
  if (actionsTakenDuringStop4) {
    types.push(4)
  }
  if (actionsTakenDuringStop5) {
    types.push(5)
  }
  if (actionsTakenDuringStop6) {
    types.push(6)
  }
  if (actionsTakenDuringStop7) {
    types.push(7)
  }
  if (actionsTakenDuringStop8) {
    types.push(8)
  }
  if (actionsTakenDuringStop9) {
    types.push(9)
  }
  if (actionsTakenDuringStop10) {
    types.push(10)
  }

  return types.map(item => {
    return {
      key: item,
      value: STOP_RESULTS[item - 1].name,
    }
  })
}

const getWarningCodes = (person, statutes) => {
  const codes = person.stopResult?.warningCodes || []

  return codes.map(code => {
    return getStatute(code, statutes)
  })
}

const getCitationCodes = (person, statutes) => {
  const codes = person.stopResult?.citationCodes || []

  return codes.map(code => {
    return getStatute(code, statutes)
  })
}

const getInfieldCodes = (person, statutes) => {
  const codes = person.stopResult?.infieldCodes || []

  return codes.map(code => {
    return getStatute(code, statutes)
  })
}

const getCustodialArrestCodes = (person, statutes) => {
  const codes = person.stopResult?.custodialArrestCodes || []

  return codes.map(code => {
    return getStatute(code, statutes)
  })
}
