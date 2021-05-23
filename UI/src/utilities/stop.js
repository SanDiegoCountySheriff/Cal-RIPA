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

export const defaultStop = officer => {
  return {
    actionsTaken: {},
    agency: officer.agency,
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
      startDate: officer.startDate,
      yearsExperience: officer.yearsExperience,
      assignment: officer.assignment,
      otherType: officer.otherType,
    },
    officerId: officer.officerId,
    officerName: officer.officerName,
    person: {
      id: new Date().getTime(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
    },
    stopReason: {},
    stopResult: {
      anyActionsTaken: true,
    },
  }
}

export const motorStop = officer => {
  return {
    actionsTaken: {},
    agency: officer.agency,
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
      startDate: officer.startDate,
      yearsExperience: officer.yearsExperience,
      assignment: officer.assignment,
      otherType: officer.otherType,
    },
    officerId: officer.officerId,
    officerName: officer.officerName,
    person: {
      id: new Date().getTime(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
    },
    stopReason: {
      reasonForStop: 1,
      trafficViolation: 1,
      trafficViolationCode: 54106,
      reasonForStopExplanation: 'Speeding',
    },
    stopResult: {
      anyActionsTaken: true,
      actionsTakenDuringStop2: true,
      actionsTakenDuringStop3: false,
      actionsTakenDuringStop4: false,
      actionsTakenDuringStop5: false,
      actionsTakenDuringStop6: false,
      actionsTakenDuringStop7: false,
      actionsTakenDuringStop8: false,
      actionsTakenDuringStop9: false,
      actionsTakenDuringStop10: false,
      actionsTakenDuringStop11: false,
      actionsTakenDuringStop12: false,
      actionsTakenDuringStop13: false,
      warningCodes: [],
      citationCodes: [54106],
      infieldCodes: [],
      custodialArrestCodes: [],
    },
  }
}

export const probationStop = officer => {
  return {
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
    agency: officer.agency,
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
      startDate: officer.startDate,
      yearsExperience: officer.yearsExperience,
      assignment: officer.assignment,
      otherType: officer.otherType,
    },
    officerId: officer.officerId,
    officerName: officer.officerName,
    person: {
      id: new Date().getTime(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
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

export const apiStopStopSummary = apiStop => {
  const items = []
  items.push(getSummaryPersonCount(apiStop))
  items.push(getSummaryDate(apiStop))
  items.push(getSummaryTime(apiStop))
  items.push(getSummaryLocation(apiStop))
  items.push(getSummaryOfficer(apiStop))
  items.push(getSummaryDuration(apiStop))
  items.push(getSummaryStopInResponseToCfs(apiStop))
  return items
}

const getSummaryPersonCount = apiStop => {
  return {
    level: 1,
    header: 'Person Count',
    detail: apiStop.listPersonStopped.length,
  }
}

const getSummaryDate = apiStop => {
  return {
    marginTop: true,
    level: 1,
    header: 'Date',
    detail: apiStop.date,
  }
}

const getSummaryTime = apiStop => {
  return {
    level: 1,
    header: 'Time',
    detail: apiStop.time,
  }
}

const getSummaryLocation = apiStop => {
  return {
    level: 3,
    header: 'Location',
    children: [
      {
        header: 'School Name',
        detail: apiStop.location.schoolName.codes.text,
      },
      { header: 'Block Number', detail: apiStop.location.blockNumber },
      { header: 'Street Name', detail: apiStop.location.streetName },
      {
        header: 'Intersection',
        detail: apiStop.location.intersection,
      },
      { header: 'Landmark', detail: apiStop.location.landMark },
      { header: 'City', detail: apiStop.location.city.codes.text },
      { header: 'Beat', detail: apiStop.location.beat.codes.text },
    ],
  }
}

const getSummaryOfficer = apiStop => {
  return {
    level: 3,
    header: 'Officer',
    children: [
      {
        header: 'Agency',
        detail: apiStop.agency,
      },
      {
        header: 'Officer ID',
        detail: apiStop.officerId,
      },
      {
        header: 'Officer Name',
        detail: apiStop.officerName,
      },
      { header: 'Years Experience', detail: apiStop.expYears },
      { header: 'Assignment', detail: apiStop.officerAssignment.type },
      {
        header: 'Other Type',
        detail: apiStop.officerAssignment.otherType,
      },
    ],
  }
}

const getSummaryDuration = apiStop => {
  return {
    level: 1,
    header: 'Duration (m)',
    detail: apiStop.stopDuration,
  }
}

const getSummaryStopInResponseToCfs = apiStop => {
  return {
    level: 1,
    header: 'Stop in Response to CFS',
    detail: apiStop.stopInResponseToCfs,
  }
}

export const apiStopPersonSummary = (apiStop, personId) => {
  const [person] = apiStop.listPersonStopped.filter(
    item => item.id === personId,
  )
  if (person) {
    const items = []
    items.push(getSummaryStudent(person))
    items.push(getSummaryPerceivedRace(person))
    items.push(getSummaryPerceivedGender(person))
    items.push(getSummaryGenderNonconforming(person))
    items.push(getSummaryPerceivedLgbt(person))
    items.push(getSummaryPerceivedAge(person))
    items.push(getSummaryLimitedEnglish(person))
    items.push(getSummaryPerceivedOrKnownDisability(person))
    items.push(getSummaryActionsTaken(person))
    items.push(getSummaryBasisForSearch(person))
    items.push(getSummaryBasisForSearchExplanation(person))
    items.push(getSummaryBasisForPropertySeizure(person))
    items.push(getSummaryTypeOfPropertySeized(person))
    items.push(getSummaryContraband(person))
    items.push(getSummaryResultOfStop(person))
    return items
  }
  return []
}

const getSummaryStudent = person => {
  return {
    level: 1,
    header: 'Is Student',
    detail: person.isStudent,
  }
}

const getSummaryPerceivedRace = person => {
  const races = person.listPerceivedRace
    .map(item => item.race)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    level: 2,
    header: 'Perceived Race',
    children: races,
  }
}

const getSummaryPerceivedGender = person => {
  return {
    level: 1,
    header: 'Perceived Gender',
    detail: person.perceivedGender,
  }
}

const getSummaryGenderNonconforming = person => {
  return {
    level: 1,
    header: 'Gender Noncomforning',
    detail: person.genderNonconforming,
  }
}

const getSummaryPerceivedLgbt = person => {
  return {
    level: 1,
    header: 'Perceived LGBT',
    detail: person.perceivedLgbt,
  }
}

const getSummaryPerceivedAge = person => {
  return {
    level: 1,
    header: 'Perceived Age',
    detail: person.perceivedAge,
  }
}

const getSummaryLimitedEnglish = person => {
  return {
    level: 1,
    header: 'Limited English',
    detail: person.perceivedLimitedEnglish,
  }
}

const getSummaryPerceivedOrKnownDisability = person => {
  const disabilities = person.listPerceivedOrKnownDisability
    .map(item => item.disability)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    level: 2,
    header: 'Perceived Disability',
    children: disabilities,
  }
}

const getSummaryActionsTaken = person => {
  const actions = person.listActionTakenDuringStop
    .map(item => item.action)
    .map(item => {
      return {
        detail: item,
      }
    })
  if (
    person.listBasisForPropertySeizure.length > 0 ||
    person.typeOfPropertySeized.length > 0
  ) {
    actions.push({
      detail: 'Property was seized',
    })
  }
  return {
    level: 2,
    header: 'Actions Taken During Stop',
    children: actions,
  }
}

const getSummaryBasisForSearch = person => {
  const basis = person.listBasisForSearch
    .map(item => item.basis)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    marginLeft: true,
    level: 2,
    header: 'Basis for Search',
    children: basis,
  }
}

const getSummaryBasisForSearchExplanation = person => {
  return {
    marginLeft: true,
    level: 1,
    header: 'Basis for Search Explanation',
    detail: person.basisForSearchBrief,
  }
}

const getSummaryBasisForPropertySeizure = person => {
  const basis = person.listBasisForPropertySeizure
    .map(item => item.basis)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    marginLeft: true,
    level: 2,
    header: 'Basis for Property Seizure',
    children: basis,
  }
}

const getSummaryTypeOfPropertySeized = person => {
  const types = person.listTypeOfPropertySeized
    .map(item => item.type)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    marginLeft: true,
    level: 2,
    header: 'Type of Property Seized',
    children: types,
  }
}

const getSummaryContraband = person => {
  const contrabands = person.listContrabandOrEvidenceDiscovered
    .map(item => item.contraband)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    level: 2,
    header: 'Contraband or Evidence Discovered',
    children: contrabands,
  }
}

const getSummaryResultOfStop = person => {
  const results = person.listResultOfStop
    .map(item => item.result)
    .map(item => {
      return {
        detail: item,
      }
    })
  return {
    level: 2,
    header: 'Result of Stop',
    children: results,
  }
}

export const apiStopToFullStop = apiStop => {
  const blockNumber = apiStop.location.blockNumber || null
  const schoolNumber = apiStop.location.schoolName?.codes?.code || null
  const cityName = apiStop.location.city?.codes?.code || null
  const beatNumber = apiStop.location.beat?.codes?.code || null

  return {
    agency: apiStop.agency,
    id: apiStop.id,
    officer: {
      editOfficer: false,
      yearsExperience: Number(apiStop.expYears),
      assignment: Number(apiStop.officerAssignment.key),
      otherType: apiStop.officerAssignment.otherType || null,
    },
    officerId: apiStop.officerId || null,
    officerName: apiStop.officerName || null,
    stopDate: {
      date: apiStop.date,
      time: apiStop.time,
      duration: Number(apiStop.stopDuration),
      stopInResponseToCfs: apiStop.stopInResponseToCfs,
    },
    location: {
      isSchool: apiStop.location.school || false,
      school: schoolNumber ? Number(schoolNumber) : null,
      blockNumber: blockNumber ? Number(blockNumber) : null,
      streetName: apiStop.location.streetName || null,
      intersection: apiStop.location.intersection || null,
      moreLocationOptions: apiStop.location.toggleLocationOptions || false,
      highwayExit: apiStop.location.highwayExit || null,
      landmark: apiStop.location.landMark || null,
      piiFound: apiStop.location.piiFound || false,
      outOfCounty: apiStop.location.outOfCounty || false,
      city: cityName || null,
      beat: beatNumber ? Number(beatNumber) : null,
    },
    people: getFullStopPeopleListed(apiStop.listPersonStopped),
  }
}

const getFullStopPeopleListed = people => {
  return people.map(person => {
    return {
      id: person.id,
      isStudent: person.isStudent,
      perceivedRace: getKeyArray(person.listPerceivedRace),
      perceivedGender: getPerceivedGenderCode(person),
      genderNonconforming: person.genderNonconforming,
      perceivedLgbt: person.perceivedLgbt,
      perceivedAge: Number(person.perceivedAge),
      perceivedLimitedEnglish: person.perceivedLimitedEnglish,
      anyDisabilities: person.listPerceivedOrKnownDisability.length > 0,
      perceivedOrKnownDisability: getKeyArray(
        person.listPerceivedOrKnownDisability,
      ),
      stopReason: {
        reasonForStop: Number(person.reasonForStop.key),
        trafficViolation: getTrafficViolationDetailKey(person.reasonForStop),
        trafficViolationCode: getTrafficViolationDetailCode(
          person.reasonForStop,
        ),
        reasonableSuspicion: getReasonableSuspicionDetailKeys(
          person.reasonForStop,
        ),
        reasonableSuspicionCode: getReasonableSuspicionDetailCode(
          person.reasonForStop,
        ),
        educationViolation: getEducationViolationDetailKey(
          person.reasonForStop,
        ),
        educationViolationCode: getEducationViolationDetailCode(
          person.reasonForStop,
        ),
        reasonForStopExplanation: person.reasonForStopExplanation,
        reasonForStopPiiFound: person.reasonForStopPiiFound,
      },
      stopResult: {
        anyActionsTaken: person.listResultOfStop.length > 0,
        actionsTakenDuringStop2: getKeyFoundInArray(person.listResultOfStop, 2),
        actionsTakenDuringStop3: getKeyFoundInArray(person.listResultOfStop, 3),
        actionsTakenDuringStop4: getKeyFoundInArray(person.listResultOfStop, 4),
        actionsTakenDuringStop5: getKeyFoundInArray(person.listResultOfStop, 5),
        actionsTakenDuringStop6: getKeyFoundInArray(person.listResultOfStop, 6),
        actionsTakenDuringStop7: getKeyFoundInArray(person.listResultOfStop, 7),
        actionsTakenDuringStop8: getKeyFoundInArray(person.listResultOfStop, 8),
        actionsTakenDuringStop9: getKeyFoundInArray(person.listResultOfStop, 9),
        actionsTakenDuringStop10: getKeyFoundInArray(
          person.listResultOfStop,
          10,
        ),
        actionsTakenDuringStop11: getKeyFoundInArray(
          person.listResultOfStop,
          11,
        ),
        actionsTakenDuringStop12: getKeyFoundInArray(
          person.listResultOfStop,
          12,
        ),
        actionsTakenDuringStop13: getKeyFoundInArray(
          person.listResultOfStop,
          13,
        ),
        warningCodes: getCodePropValueGivenKeyInArray(
          person.listResultOfStop,
          2,
        ),
        citationCodes: getCodePropValueGivenKeyInArray(
          person.listResultOfStop,
          3,
        ),
        infieldCodes: getCodePropValueGivenKeyInArray(
          person.listResultOfStop,
          4,
        ),
        custodialArrestCodes: getCodePropValueGivenKeyInArray(
          person.listResultOfStop,
          6,
        ),
      },
      actionsTaken: {
        anyActionsTaken: person.listActionTakenDuringStop.length > 0,
        actionsTakenDuringStop: getKeyArray(person.listActionTakenDuringStop),
        personSearchConsentGiven: getBooleanPropValueGivenKeyInArray(
          person.listActionTakenDuringStop,
          17,
          'personSearchConsentGiven',
        ),
        propertySearchConsentGiven: getBooleanPropValueGivenKeyInArray(
          person.listActionTakenDuringStop,
          19,
          'propertySearchConsentGiven',
        ),
        basisForSearch: getKeyArray(person.listBasisForSearch),
        basisForSearchExplanation: person.basisForSearchBrief,
        basisForSearchPiiFound: person.basisForSearchPiiFound,
        propertyWasSeized:
          person.listBasisForPropertySeizure.length > 0 ||
          person.typeOfPropertySeized.length > 0,
        basisForPropertySeizure: getKeyArray(
          person.listBasisForPropertySeizure,
        ),
        typeOfPropertySeized: getKeyArray(person.listTypeOfPropertySeized),
      },
    }
  })
}

const getTrafficViolationDetailKey = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 1) {
    return Number(stopReason.listDetail[0].key)
  }

  return null
}

const getTrafficViolationDetailCode = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 1) {
    return Number(stopReason.listCodes[0].code)
  }

  return null
}

const getReasonableSuspicionDetailKeys = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 2) {
    return stopReason.listDetail.map(item => Number(item.key))
  }

  return null
}

const getReasonableSuspicionDetailCode = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 2) {
    return Number(stopReason.listCodes[0].code)
  }

  return null
}

const getEducationViolationDetailKey = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 7) {
    return Number(stopReason.listDetail[0].key)
  }

  return null
}

const getEducationViolationDetailCode = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 7) {
    return Number(stopReason.listCodes[0].code)
  }

  return null
}

const getKeyFoundInArray = (items, key) => {
  return items.filter(item => Number(item.key) === key).length > 0
}

const getCodePropValueGivenKeyInArray = (items, key) => {
  const [filteredItem] = items.filter(item => Number(item.key) === key)
  return filteredItem
    ? filteredItem.listCodes.map(item => Number(item.code))
    : null
}

const getBooleanPropValueGivenKeyInArray = (items, key, prop) => {
  const [filteredItem] = items.filter(item => Number(item.key) === key)
  return filteredItem ? filteredItem[prop] : false
}

const getKeyArray = items => {
  return items.map(item => Number(item.key))
}

export const fullStopToApiStop = (
  fullStop,
  beats,
  countyCities,
  nonCountyCities,
  schools,
  statutes,
) => {
  const assignment = getOfficerAssignment(fullStop)
  const outOfCounty = fullStop.location?.outOfCounty || false
  const duration = fullStop.stopDate?.duration || null

  return {
    agency: fullStop.agency,
    date: fullStop.stopDate.date,
    expYears: fullStop.officer?.yearsExperience?.toString() || '',
    id: fullStop.id,
    isPiiFound: getPiiFound(fullStop),
    listPersonStopped: getApiStopPeopleListed(fullStop, statutes),
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
      otherType: fullStop.officer?.otherType || '',
      type: assignment.text,
    },
    officerId: fullStop.officerId,
    officerName: fullStop.officerName,
    stopDateTime: formatDateTime(
      fullStop.stopDate.date,
      fullStop.stopDate.time,
    ),
    stopDuration: duration ? duration.toString() : null,
    stopInResponseToCfs: fullStop.stopDate?.stopInResponseToCfs || false,
    time: fullStop.stopDate.time,
  }
}

export const getApiStopPeopleListed = (fullStop, statutes) => {
  return fullStop.people.map(person => {
    return {
      basisForSearchBrief:
        person.actionsTaken?.basisForSearchExplanation || null,
      basisForSearchPiiFound:
        person.actionsTaken?.basisForSearchPiiFound || false,
      genderNonconforming: person.genderNonconforming || false,
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
    const [filteredAssignment] = OFFICER_ASSIGNMENTS.filter(
      item => item.value === assignment,
    )

    return {
      code: assignment.toString(),
      text: filteredAssignment ? filteredAssignment.name : 'N/A',
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
    const [filteredRace] = RACES.filter(item2 => item2.value === item)

    return {
      key: item.toString(),
      race: filteredRace ? filteredRace.name : 'N/A',
    }
  })
}

const getPerceivedGender = person => {
  const gender = person.perceivedGender || null
  if (gender) {
    const [filteredGenderValue] = GENDERS.filter(item => item.value === gender)
    const [filteredGenderName] = GENDERS.filter(item => item.name === gender)
    const filteredGender = filteredGenderValue || filteredGenderName

    return {
      code: filteredGender ? filteredGender.value : null,
      text: filteredGender ? filteredGender.name : 'N/A',
    }
  }

  return null
}

const getPerceivedGenderCode = person => {
  const gender = getPerceivedGender(person)
  return gender ? gender.code : null
}

const getPerceivedGenderText = person => {
  const gender = getPerceivedGender(person)
  return gender ? gender.text : ''
}

const getPerceivedOrKnownDisability = person => {
  const disability = person.perceivedOrKnownDisability || []

  const mappedItems = disability.map(item => {
    const [filteredDisability] = DISABILITIES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      disability: filteredDisability ? filteredDisability.name : 'N/A',
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
    const [filteredReason] = STOP_REASONS.filter(item => item.value === reason)

    return {
      key: reason.toString(),
      reason: filteredReason ? filteredReason.name : 'N/A',
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
    const [filteredViolation] = EDUCATION_VIOLATIONS.filter(
      item => item.value === violation,
    )

    return {
      key: violation.toString(),
      reason: filteredViolation ? filteredViolation.name : 'N/A',
    }
  }

  return null
}

const getTrafficViolation = person => {
  const violation = person.stopReason?.trafficViolation || null
  if (violation) {
    const [filteredViolation] = TRAFFIC_VIOLATIONS.filter(
      item => item.value === violation,
    )

    return {
      key: violation.toString(),
      reason: filteredViolation ? filteredViolation.name : 'N/A',
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
    const [filteredSuspicion] = REASONABLE_SUSPICIONS.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      reason: filteredSuspicion ? filteredSuspicion.name : 'N/A',
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
    const [filteredAction] = ACTIONS_TAKEN.filter(item2 => item2.value === item)

    const action = {
      key: item.toString(),
      action: filteredAction ? filteredAction.name : 'N/A',
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
    const [filteredBasis] = BASIS_FOR_SEARCH.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      basis: filteredBasis ? filteredBasis.name : 'N/A',
    }
  })
}

const getBasisForPropertySeizure = person => {
  const basis = person.actionsTaken?.basisForPropertySeizure || []

  return basis.map(item => {
    const [filteredBasis] = BASIS_FOR_PROPERTY_SEIZURE.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      basis: filteredBasis ? filteredBasis.name : 'N/A',
    }
  })
}

const getTypeOfPropertySeized = person => {
  const types = person.actionsTaken?.typeOfPropertySeized || []

  return types.map(item => {
    const [filteredType] = SEIZED_PROPERTY_TYPES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      type: filteredType ? filteredType.name : 'N/A',
    }
  })
}

const getContrabandOrEvidenceDiscovered = person => {
  const contrabands = person.actionsTaken?.contrabandOrEvidenceDiscovered || []

  const mappedItems = contrabands.map(item => {
    const [filteredType] = CONTRABAND_TYPES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      contraband: filteredType ? filteredType.name : 'N/A',
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
  const actionsTakenDuringStop11 =
    person.stopResult?.actionsTakenDuringStop11 || false
  const actionsTakenDuringStop12 =
    person.stopResult?.actionsTakenDuringStop12 || false
  const actionsTakenDuringStop13 =
    person.stopResult?.actionsTakenDuringStop13 || false

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
  if (actionsTakenDuringStop11) {
    types.push(11)
  }
  if (actionsTakenDuringStop12) {
    types.push(12)
  }
  if (actionsTakenDuringStop13) {
    types.push(13)
  }

  const mappedItems = types.map(item => {
    const [filteredStopResult] = STOP_RESULTS.filter(
      item2 => item2.value === item,
    )

    const stopResult = {
      key: item.toString(),
      result: filteredStopResult ? filteredStopResult.name : 'N/A',
    }
    if (item === 2) {
      stopResult.listCodes = getWarningCodes(person, statutes)
    }
    if (item === 3) {
      stopResult.listCodes = getCitationCodes(person, statutes)
    }
    if (item === 4) {
      stopResult.listCodes = getInfieldCodes(person, statutes)
    }
    if (item === 6) {
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
