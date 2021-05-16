import { format } from 'date-fns'
import { formatDateTime, uniqueId } from '@/utilities/dates'
import {
  OFFICER_ASSIGNMENTS,
  RACES,
  GENDERS,
  DISABILITIES,
  STOP_REASONS,
  EDUCATION_VIOLATIONS,
  EDUCATION_CODE_SECTIONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  CONTRABAND_TYPES,
  SEIZED_PROPERTY_TYPES,
  STOP_RESULTS,
} from '@/constants/form'

export const defaultStop = (
  yearsExperience,
  assignment,
  otherType,
  officerId,
  agency,
) => {
  return {
    actionsTaken: {},
    agency,
    id: uniqueId(),
    created: new Date(),
    location: {
      isSchool: false,
      school: null,
      fullAddress: '',
      blockNumber: null,
      streetName: null,
      intersection: null,
      moreLocationOptions: false,
      highwayExit: null,
      landmark: null,
      outOfCounty: false,
      city: null,
      beat: null,
    },
    officer: {
      editOfficer: false,
      yearsExperience,
      assignment,
      otherType,
    },
    officerId,
    person: {
      id: new Date().getTime(),
      index: 1,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'k:mm'),
    },
    stopReason: {},
    stopResult: {
      anyActionsTaken: true,
    },
  }
}

export const motorStop = (
  yearsExperience,
  assignment,
  otherType,
  officerId,
  agency,
) => {
  return {
    actionsTaken: {},
    agency,
    created: new Date(),
    id: uniqueId(),
    location: {
      isSchool: false,
      school: null,
      fullAddress: '',
      blockNumber: null,
      streetName: null,
      intersection: null,
      moreLocationOptions: false,
      highwayExit: null,
      landmark: null,
      outOfCounty: false,
      city: null,
      beat: null,
    },
    officer: {
      editOfficer: false,
      yearsExperience,
      assignment,
      otherType,
    },
    officerId,
    person: {
      id: new Date().getTime(),
      index: 1,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'k:mm'),
    },
    stopReason: {
      reasonForStop: 1,
      trafficViolation: 1,
      trafficViolationCode: 54106,
      reasonForStopExplanation: 'Speeding',
    },
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
      actionsTakenDuringStop12: false,
      actionsTakenDuringStop13: false,
      warningCodes: [],
      citationCodes: [54106],
      infieldCodes: [],
      custodialArrestCodes: [],
    },
  }
}

export const probationStop = (
  yearsExperience,
  assignment,
  otherType,
  officerId,
  agency,
) => {
  return {
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
    agency,
    created: new Date(),
    id: uniqueId(),
    location: {
      isSchool: false,
      school: null,
      fullAddress: '',
      blockNumber: null,
      streetName: null,
      intersection: null,
      moreLocationOptions: false,
      highwayExit: null,
      landmark: null,
      outOfCounty: false,
      city: null,
      beat: null,
    },
    officer: {
      editOfficer: false,
      yearsExperience: yearsExperience,
      assignment: assignment,
      otherType,
    },
    officerId,
    person: {
      id: new Date().getTime(),
      index: 1,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'k:mm'),
    },
    stopReason: {
      reasonForStop: 3,
      reasonForStopExplanation:
        'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
    },
    stopResult: {
      anyActionsTaken: true,
    },
  }
}

export const apiStop = (
  fullStop,
  beats,
  countyCities,
  nonCountyCities,
  schools,
  statutes,
) => {
  const assignment = getOfficerAssignment(fullStop)
  const outOfCounty = fullStop.location?.outOfCounty || false

  return {
    agency: fullStop.officerId,
    date: fullStop.stopDate.date,
    expYears: fullStop.officer?.yearsExperience?.toString() || '',
    id: fullStop.id,
    isPiiFound: getPiiFound(fullStop),
    listPersonStopped: getPeopleListed(fullStop, statutes),
    location: {
      beat: getBeat(fullStop, beats),
      blockNumber: fullStop.location?.blockNumber?.toString() || '',
      city: getCity(fullStop, outOfCounty ? nonCountyCities : countyCities),
      fullAddress: fullStop.location?.fullAddress || '',
      highwayExit: fullStop.location?.highwayExit || '',
      intersection: fullStop.location?.intersection || '',
      landMark: fullStop.location?.landmark || '',
      outOfCounty,
      piiFound: fullStop.location?.piiFound || false,
      school: fullStop.location?.isSchool || false,
      schoolName: getSchool(fullStop, schools),
      streetName: fullStop.location?.streetName || '',
      toggleLocationOptions: fullStop.location?.moreLocationOptions || false,
    },
    officerAssignment: {
      key: assignment.code.toString(),
      otherType: stop.officer?.otherType || '',
      type: assignment.text,
    },
    officerId: fullStop.officerId,
    stopDateTime: formatDateTime(
      fullStop.stopDate.date,
      fullStop.stopDate.time,
    ),
    stopDuration: '30',
    stopInResponseToCfs: fullStop.stopDate?.stopInResponseToCfs || false,
    time: fullStop.stopDate.time,
  }
}

export const getPeopleListed = (fullStop, statutes) => {
  return fullStop.people.map(person => {
    return {
      basisForSearchBrief:
        person.actionsTaken?.basisForSearchExplanation || null,
      basisForSearchPiiFound:
        person.actionsTaken?.basisForSearchPiiFound || false,
      genderNonconforming: person.person?.genderNonconforming || false,
      id: person.id,
      isStudent: person.isStudent || false,
      listActionTakenDuringStop: getActionsTakenDuringStop(person),
      listBasisForPropertySeizure: getBasisForPropertySeizure(person),
      listBasisForSearch: getBasisForSearch(person),
      listContrabandOrEvidenceDiscovered:
        getContrabandOrEvidenceDiscovered(person),
      listPerceivedOrKnownDisability: getPerceivedOrKnownDisability(person),
      listPerceivedRace: getPerceivedRace(person),
      listResultOfStop: getResultOfStop(person, statutes),
      listTypeOfPropertySeized: getTypeOfPropertySeized(person),
      perceivedAge: person.perceivedAge?.toString() || null,
      perceivedGender: getPerceivedGenderText(person),
      perceivedLgbt: person.perceivedLgbt || false,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish || false,
      reasonForStop: getReasonForStop(person, statutes),
      reasonForStopExplanation:
        person.stopReason?.reasonForStopExplanation || null,
      reasonForStopPiiFound: person.stopReason?.reasonForStopPiiFound || false,
    }
  })
}

const getPiiFound = fullStop => {
  const locationPiiFound = fullStop.location?.piiFound || false
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

  return locationPiiFound || reasonForStopPiiFound || basisForSearchPiiFound
}

const getOfficerAssignment = fullStop => {
  const assignment = fullStop.officer?.assignment || null
  if (assignment) {
    return {
      code: assignment.toString(),
      text: assignment ? OFFICER_ASSIGNMENTS[assignment - 1].name : 'N/A',
    }
  }

  return {
    code: '',
    text: '',
  }
}

const getSchool = (fullStop, schools) => {
  const school = fullStop.location?.school || null

  if (school) {
    const [filteredSchool] = schools.filter(item => item.cdsCode === school)
    return {
      codes: {
        code: school.toString(),
        text: filteredSchool ? filteredSchool.fullName : 'N/A',
      },
    }
  }

  return null
}

const getCity = (fullStop, cities) => {
  const city = fullStop.location?.city || null

  if (city) {
    const [filteredCity] = cities.filter(item => item.id === city)
    return {
      codes: {
        code: city.toString(),
        text: filteredCity ? filteredCity.fullName : 'N/A',
      },
    }
  }

  return null
}

const getBeat = (fullStop, beats) => {
  const beat = fullStop.location?.beat || null

  if (beat) {
    const [filteredBeat] = beats.filter(item => item.id === beat)
    return {
      codes: {
        code: beat.toString(),
        text: filteredBeat ? filteredBeat.fullName : 'N/A',
      },
    }
  }

  return null
}

const getPerceivedRace = person => {
  const race = person.perceivedRace || []

  return race.map(item => {
    return {
      key: item.toString(),
      race: RACES[item - 1].name,
    }
  })
}

const getPerceivedGender = person => {
  const gender = person.perceivedGender || null
  if (gender) {
    return {
      code: gender.toString(),
      text: gender ? GENDERS[gender - 1].name : 'N/A',
    }
  }

  return null
}

const getPerceivedGenderText = person => {
  const gender = getPerceivedGender(person)
  return gender ? gender.text : ''
}

const getPerceivedOrKnownDisability = person => {
  const disability = person.perceivedOrKnownDisability || []

  const mappedItems = disability.map(item => {
    return {
      key: item.toString(),
      disability: DISABILITIES[item - 1].name,
    }
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '8',
      disability: 'None',
    },
  ]
}

const getReasonForStop = (person, statutes) => {
  const reason = person.stopReason?.reasonForStop || null

  if (reason) {
    return {
      key: reason.toString(),
      reason: reason ? STOP_REASONS[reason - 1].name : 'N/A',
      listDetail: getReasonForStopDetails(reason, person),
      listCodes: getReasonForStopCodes(reason, person, statutes),
    }
  }

  return null
}

const getReasonForStopDetails = (reasonKey, person) => {
  if (reasonKey === 1) {
    return [getTrafficViolation(person)]
  }
  if (reasonKey === 2) {
    return [getReasonableSuspicion(person)]
  }
  if (reasonKey === 7) {
    return [getEducationViolation(person)]
  }

  return []
}

const getReasonForStopCodes = (reasonKey, person, statutes) => {
  if (reasonKey === 1) {
    return [getTrafficViolationCode(person, statutes)]
  }
  if (reasonKey === 2) {
    return [getReasonableSuspicionCode(person, statutes)]
  }
  if (reasonKey === 7) {
    return [getEducationViolationCode(person)]
  }

  return []
}

const getEducationViolation = person => {
  const violation = person.stopReason?.educationViolation || null
  if (violation) {
    return {
      key: violation.toString(),
      reason: violation ? EDUCATION_VIOLATIONS[violation - 1].name : 'N/A',
    }
  }

  return null
}

const getTrafficViolation = person => {
  const violation = person.stopReason?.trafficViolation || null
  if (violation) {
    return {
      key: violation.toString(),
      reason: violation ? TRAFFIC_VIOLATIONS[violation - 1].name : 'N/A',
    }
  }

  return null
}

const getStatute = (code, statutes) => {
  if (code) {
    const [filteredStatute] = statutes.filter(item => item.code === code)
    return {
      code: code.toString(),
      text: filteredStatute ? filteredStatute.fullName : 'N/A',
    }
  }

  return null
}

const getEducationCodeSection = code => {
  if (code) {
    const [filteredSubsection] = EDUCATION_CODE_SECTIONS.filter(
      item => item.code === code,
    )
    return {
      code: code.toString(),
      text: filteredSubsection ? filteredSubsection.fullName : 'N/A',
    }
  }

  return null
}

const getEducationViolationCode = person => {
  const code = person.stopReason?.educationViolationCode || null
  if (code) {
    return getEducationCodeSection(code)
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
      key: item.toString(),
      reason: REASONABLE_SUSPICIONS[item - 1].name,
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

  const mappedItems = actions.map(item => {
    const action = {
      key: item.toString(),
      action: ACTIONS_TAKEN[item - 1].name,
    }
    if (item === 17) {
      action.personSearchConsentGiven =
        person.actionsTaken?.personSearchConsentGiven || false
    }
    if (item === 19) {
      action.propertySearchConsentGiven =
        person.actionsTaken.propertySearchConsentGiven || false
    }

    return action
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '24',
      action: 'None',
    },
  ]
}

const getBasisForSearch = person => {
  const basis = person.actionsTaken?.basisForSearch || []

  return basis.map(item => {
    return {
      key: item.toString(),
      basis: BASIS_FOR_SEARCH[item - 1].name,
    }
  })
}

const getBasisForPropertySeizure = person => {
  const basis = person.actionsTaken?.basisForPropertySeizure || []

  return basis.map(item => {
    return {
      key: item.toString(),
      basis: BASIS_FOR_PROPERTY_SEIZURE[item - 1].name,
    }
  })
}

const getTypeOfPropertySeized = person => {
  const types = person.actionsTaken?.typeOfPropertySeized || []

  return types.map(item => {
    return {
      key: item.toString(),
      type: SEIZED_PROPERTY_TYPES[item - 1].name,
    }
  })
}

const getContrabandOrEvidenceDiscovered = person => {
  const contrabands = person.actionsTaken?.contrabandOrEvidenceDiscovered || []

  const mappedItems = contrabands.map(item => {
    return {
      key: item.toString(),
      contraband: CONTRABAND_TYPES[item - 1].name,
    }
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '1',
      contraband: 'None',
    },
  ]
}

const getResultOfStop = (person, statutes) => {
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
  const actionsTakenDuringStop12 =
    person.stopResult?.actionsTakenDuringStop12 || false
  const actionsTakenDuringStop13 =
    person.stopResult?.actionsTakenDuringStop13 || false

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
  if (actionsTakenDuringStop12) {
    types.push(12)
  }
  if (actionsTakenDuringStop13) {
    types.push(13)
  }

  const mappedItems = types.map(item => {
    const stopResult = {
      key: item.toString(),
      result: STOP_RESULTS[item - 1].name,
    }
    if (item === 1) {
      stopResult.listCodes = getWarningCodes(person, statutes)
    }
    if (item === 2) {
      stopResult.listCodes = getCitationCodes(person, statutes)
    }
    if (item === 3) {
      stopResult.listCodes = getInfieldCodes(person, statutes)
    }
    if (item === 5) {
      stopResult.listCodes = getCustodialArrestCodes(person, statutes)
    }

    return stopResult
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '1',
      result: 'None',
    },
  ]
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
