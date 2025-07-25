import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { formatDateTime } from '@/utilities/dates'
import {
  OFFICER_ASSIGNMENTS,
  OFFICER_ASSIGNMENTS_V2,
  RACES,
  RACES_V2,
  GENDERS,
  DISABILITIES,
  STOP_REASONS,
  STOP_REASONS_V2,
  PROBABLE_CAUSES,
  EDUCATION_VIOLATIONS,
  EDUCATION_CODE_SECTIONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  REASONABLE_SUSPICIONS_V2,
  ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  CONTRABAND_TYPES,
  SEIZED_PROPERTY_TYPES,
  STOP_RESULTS,
  SEXUAL_ORIENTATIONS,
} from '@/constants/form'
import {
  BASIS_FOR_SEARCH_V2,
  FORCE_ACTIONS_TAKEN,
  GIVEN_STOP_REASONS_V2,
  NON_FORCE_ACTIONS_TAKEN,
  PERSON_GENDERS_V2,
  STOP_RESULTS_V2,
} from '../constants/form'

const getAgencyQuestionsFromLocalStorage = () => {
  const questions = localStorage.getItem('ripa_agency_questions')
  return questions ? JSON.parse(questions) : []
}

const mappedAgencyQuestions = () => {
  return getAgencyQuestionsFromLocalStorage().map(item => {
    return {
      ...item,
      answer: null,
    }
  })
}

const getLastLocation = () => {
  const lastLocation = localStorage.getItem('ripa_last_location')
  if (lastLocation) {
    return JSON.parse(lastLocation)
  }

  return null
}

const emptyLocation = () => {
  return {
    isSchool: false,
    school: null,
    fullAddress: '',
    blockNumber: '',
    streetName: '',
    intersection: '',
    crossStreet1: '',
    crossStreet2: '',
    toggleLocationOptions: false,
    highwayExit: '',
    highway: '',
    exit: '',
    landmark: '',
    outOfCounty: false,
    city: null,
    beat: null,
    latitude: null,
    longitude: null,
  }
}

export const defaultLocation = () => {
  const lastLocation = getLastLocation()
  if (lastLocation) {
    return lastLocation
  }

  return emptyLocation()
}

export const defaultStop = () => {
  return {
    id: 0,
    internalId: nanoid(),
    template: null,
    editStopExplanation: null,
    overridePii: false,
    piiEntities: [],
    stepTrace: [],
    stopType: null,
    officerWorksWithNonReportingAgency: false,
    nonForceActionsTaken: {
      anyNonForceActionsTaken: true,
      nonForceActionsTakenDuringStop: [],
      personSearchConsentGiven: false,
      propertySearchConsentGiven: false,
      basisForSearch: [],
      basisForSearchExplanation: null,
      basisForSearchPiiFound: false,
      propertyWasSeized: false,
      basisForPropertySeizure: [],
      typeOfPropertySeized: [],
      anyContraband: false,
      contrabandOrEvidenceDiscovered: [],
    },
    forceActionsTaken: {
      anyForceActionsTaken: false,
      forceActionsTakenDuringStop: [],
    },
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [],
      personSearchConsentGiven: false,
      propertySearchConsentGiven: false,
      basisForSearch: [],
      basisForSearchExplanation: null,
      basisForSearchPiiFound: false,
      propertyWasSeized: false,
      basisForPropertySeizure: [],
      typeOfPropertySeized: [],
      anyContraband: false,
      contrabandOrEvidenceDiscovered: [],
    },
    location: emptyLocation(),
    person: {
      id: new Date().getTime(),
      index: 1,
      anyDisabilities: false,
      isStudent: false,
      perceivedAge: null,
      perceivedGender: null,
      genderNonconforming: null,
      nonBinaryPerson: null,
      perceivedLimitedEnglish: false,
      perceivedLgbt: new Date() >= new Date(2024, 0, 1) ? null : false,
      perceivedSexualOrientation: null,
      perceivedOrKnownDisability: [],
      perceivedRace: [],
      insideResidence: null,
      passengerInVehicle: null,
      perceivedUnhoused: false,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
      duration: null,
      stopInResponseToCFS: false,
      lateSubmissionExplanation: null,
    },
    stopReason: stopReasonGivenTemplate(),
    stopResult: stopResultGivenTemplate(),
    agencyQuestions: mappedAgencyQuestions(),
    stopVersion: new Date() >= new Date(2024, 0, 1) ? 2 : 1,
  }
}

export const stopReasonGivenTemplate = template => {
  if (template === 'motor') {
    return {
      reasonForStop: 1,
      trafficViolation: 1,
      trafficViolationCode: 54106,
      reasonForStopExplanation: 'Speeding',
    }
  }

  if (template === 'probation') {
    return {
      reasonForStop: 3,
      reasonForStopExplanation:
        'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
    }
  }

  return {
    reasonForStop: null,
    reasonGivenForStop: null,
    educationViolation: null,
    educationViolationCode: null,
    trafficViolation: null,
    trafficViolationCode: null,
    reasonableSuspicion: [],
    reasonableSuspicionCode: null,
    probableCauseCode: null,
    searchOfPerson: null,
    searchOfProperty: null,
    reasonForStopExplanation: null,
    reasonForStopPiiFound: false,
  }
}

export const stopResultGivenTemplate = template => {
  if (template === 'motor') {
    return {
      anyResultsOfStop: true,
      resultsOfStop2: false,
      resultsOfStop3: false,
      resultsOfStop4: true,
      resultsOfStop5: false,
      resultsOfStop6: false,
      resultsOfStop7: false,
      resultsOfStop8: false,
      resultsOfStop9: false,
      resultsOfStop10: false,
      resultsOfStop11: false,
      resultsOfStop12: false,
      resultsOfStop13: false,
      resultsOfStop14: false,
      warningCodes: [],
      verbalWarningCodes: [],
      writtenWarningCodes: [],
      citationCodes: [54106],
      infieldCodes: [],
      custodialArrestCodes: [],
      pullFromReasonCode: true,
    }
  }

  if (template === 'probation') {
    return {
      anyResultsOfStop: false,
      pullFromReasonCode: false,
    }
  }

  return {
    anyResultsOfStop: true,
    resultsOfStop2: false,
    resultsOfStop3: false,
    resultsOfStop4: false,
    resultsOfStop5: false,
    resultsOfStop6: false,
    resultsOfStop7: false,
    resultsOfStop8: false,
    resultsOfStop9: false,
    resultsOfStop10: false,
    resultsOfStop11: false,
    resultsOfStop12: false,
    resultsOfStop13: false,
    resultsOfStop14: false,
    warningCodes: [],
    verbalWarningCodes: [],
    writtenWarningCodes: [],
    citationCodes: [],
    infieldCodes: [],
    custodialArrestCodes: [],
    pullFromReasonCode: false,
  }
}

export const apiStopStopSummary = apiStop => {
  const items = []
  items.push({ id: 'A1', content: getSummaryPersonCount(apiStop) })
  if (apiStop.stopVersion === 2) {
    items.push({ id: 'A2', content: getSummaryStopType(apiStop) })
    items.push({
      id: 'A10',
      content: getSummaryOfficerNonReportingAgency(apiStop),
    })
  }
  items.push({ id: 'A3', content: getSummaryDate(apiStop) })
  items.push({ id: 'A4', content: getSummaryTime(apiStop) })
  items.push({ id: 'A5', content: getSummaryLocation(apiStop) })
  if (apiStop.stopVersion === 2) {
    items.push({ id: 'A6', content: getSummaryOfficerV2(apiStop) })
  } else {
    items.push({ id: 'A6', content: getSummaryOfficer(apiStop) })
  }
  items.push({ id: 'A7', content: getSummaryDuration(apiStop) })
  items.push({ id: 'A8', content: getSummaryStopInResponseToCfs(apiStop) })
  if (apiStop.stopVersion === 2) {
    items.push({
      id: 'A9',
      content: getSummaryStopMadeDuringWelfareCheck(apiStop),
    })
  }
  if (apiStop.lateSubmissionExplanation) {
    items.push({ id: 'A11', content: getSummaryLateExplanation(apiStop) })
  }
  return items
}

export const apiStopEditExplanationSummary = apiStop => {
  return {
    level: 1,
    header: 'Reason for Edit',
    detail: getStopEditExplanation(apiStop),
  }
}

const getStopEditExplanation = apiStop => {
  if (apiStop.id.length <= 12) {
    const submittedApiStop = JSON.parse(
      localStorage.getItem('ripa_form_submitted_api_stop'),
    )
    return submittedApiStop.editStopExplanation
  } else {
    return apiStop.editStopExplanation
  }
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

const getSummaryLateExplanation = apiStop => {
  return {
    level: 1,
    header: 'Late Submission Explanation',
    detail: apiStop.lateSubmissionExplanation,
  }
}

const getSummaryStopType = apiStop => {
  return {
    level: 1,
    header: 'Stop Type',
    detail: apiStop.stopType,
  }
}

const getSummaryOfficerNonReportingAgency = apiStop => {
  return {
    level: 1,
    header: 'Officer Secondary to Non-Reporting Agency',
    detail: apiStop.officerWorksWithNonReportingAgency,
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
  const children = []

  if (apiStop.location.school && apiStop.location.schoolName.codes) {
    children.push({
      header: 'School Name',
      detail: apiStop.location.schoolName.codes.text,
    })
  }
  if (apiStop.location.blockNumber) {
    children.push({
      header: 'Block Number',
      detail: apiStop.location.blockNumber,
    })
  }
  if (apiStop.location.streetName) {
    children.push({
      header: 'Street Name',
      detail: apiStop.location.streetName,
    })
  }
  if (apiStop.location.intersection) {
    children.push({
      header: 'Intersection',
      detail: apiStop.location.intersection,
    })
  }
  if (apiStop.location.crossStreet1) {
    children.push({
      header: 'Cross Street 1',
      detail: apiStop.location.crossStreet1,
    })
  }
  if (apiStop.location.crossStreet2) {
    children.push({
      header: 'Cross Street 2',
      detail: apiStop.location.crossStreet2,
    })
  }
  if (apiStop.location.highwayExit) {
    children.push({
      header: 'Highway Exit',
      detail: apiStop.location.highwayExit,
    })
  }
  if (apiStop.location.highway) {
    children.push({
      header: 'Highway',
      detail: apiStop.location.highway,
    })
  }
  if (apiStop.location.exit) {
    children.push({
      header: 'Closest Exit',
      detail: apiStop.location.exit,
    })
  }
  if (apiStop.location.landMark) {
    children.push({
      header: 'Landmark',
      detail: apiStop.location.landMark,
    })
  }
  if (apiStop.location.city && apiStop.location.city.codes) {
    children.push({
      header: 'City',
      detail: apiStop.location.city.codes.text,
    })
  }
  if (apiStop.location.beat && apiStop.location.beat.codes) {
    children.push({
      header: 'Beat',
      detail: apiStop.location.beat.codes.text,
    })
  }
  if (
    apiStop.location.geoLocation.latitude &&
    apiStop.location.geoLocation.longitude
  ) {
    children.push({
      header: 'Latitude',
      detail: apiStop.location.geoLocation.latitude,
    })
    children.push({
      header: 'Longitude',
      detail: apiStop.location.geoLocation.longitude,
    })
  }

  return {
    level: 3,
    header: 'Location',
    children,
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

const getSummaryOfficerV2 = apiStop => {
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
      {
        header: 'Officer Race',
        detail: getOfficerRace(apiStop.officerRace),
      },
      // {
      //   header: 'Officer Gender',
      //   detail: apiStop.officerGender,
      // },
      // {
      //   header: 'Officer Nonbinary',
      //   detail: apiStop.officerNonBinary,
      // },
    ],
  }
}

const getOfficerRace = officerRace => {
  let raceString = ''

  for (const race of officerRace) {
    raceString += race + ', '
  }

  return raceString.slice(0, -2)
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
    detail: apiStop.stopInResponseToCFS || false,
  }
}

const getSummaryStopMadeDuringWelfareCheck = apiStop => {
  return {
    level: 1,
    header: 'Stop Made During a Welfare or Wellness Check',
    detail: apiStop.stopMadeDuringWelfareCheck || false,
  }
}

export const apiStopPersonSummary = (apiStop, personId, statutes) => {
  const [person] = apiStop.listPersonStopped.filter(
    item => item.id === personId,
  )
  if (person) {
    const items = []
    items.push({ id: 'B1', content: getSummaryStudent(person) })
    items.push({ id: 'B2', content: getSummaryPerceivedRace(person) })
    if (apiStop.stopVersion === 1) {
      items.push({ id: 'B3', content: getSummaryGenderNonconforming(person) })
    }
    if (apiStop.stopVersion === 2) {
      items.push({ id: 'B3', content: getSummaryNonbinaryPerson(person) })
    }
    items.push({ id: 'B4', content: getSummaryPerceivedGender(person) })
    if (apiStop.stopVersion === 2) {
      items.push({ id: 'B5', content: getSummaryPerceivedOrientation(person) })
    }
    if (apiStop.stopVersion === 1) {
      items.push({ id: 'B5', content: getSummaryPerceivedLgbt(person) })
    }
    items.push({ id: 'B6', content: getSummaryPerceivedAge(person) })
    items.push({ id: 'B7', content: getSummaryLimitedEnglish(person) })
    if (apiStop.stopVersion === 2) {
      items.push({ id: 'B18', content: getSummaryPerceivedUnhoused(person) })
      if (
        person.passengerInVehicle === true ||
        person.passengerInVehicle === false
      ) {
        items.push({ id: 'B19', content: getSummaryPassengerInVehicle(person) })
      }
      if (person.insideResidence === true || person.insideResidence === false) {
        items.push({ id: 'B22', content: getSummaryInsideResidence(person) })
      }
    }
    items.push({
      id: 'B8',
      content: getSummaryPerceivedOrKnownDisability(person),
    })
    items.push({ id: 'B9', content: getSummaryReasonForStop(person, statutes) })
    if (apiStop.stopVersion === 2) {
      items.push({ id: '22', content: getSummaryReasonGivenForStop(person) })
    }
    items.push({
      id: 'B10',
      content: getSummaryReasonForStopExplanation(person),
    })
    if (apiStop.stopVersion === 1) {
      items.push({ id: 'B11', content: getSummaryActionsTaken(person) })
    }
    if (apiStop.stopVersion === 2) {
      items.push({ id: 'B21', content: getSummaryNonForceActionsTaken(person) })
    }
    if (person.listBasisForSearch.length > 0) {
      items.push({ id: 'B12', content: getSummaryBasisForSearch(person) })
      items.push({
        id: 'B13',
        content: getSummaryBasisForSearchExplanation(person),
      })
    }
    if (person.listBasisForPropertySeizure.length > 0) {
      items.push({
        id: 'B14',
        content: getSummaryBasisForPropertySeizure(person),
      })
      items.push({ id: 'B15', content: getSummaryTypeOfPropertySeized(person) })
    }
    items.push({ id: 'B16', content: getSummaryContraband(person) })
    if (apiStop.stopVersion === 2) {
      items.push({ id: 'B20', content: getSummaryForceActionsTaken(person) })
    }
    items.push({ id: 'B17', content: getSummaryResultOfStop(person, statutes) })
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

const getSummaryPerceivedOrientation = person => {
  return {
    level: 1,
    header: 'Perceived Orientation',
    detail: person.perceivedSexualOrientation,
  }
}

const getSummaryGenderNonconforming = person => {
  return {
    level: 1,
    header: 'Gender Nonconforming',
    detail: person.genderNonconforming,
  }
}

const getSummaryNonbinaryPerson = person => {
  return {
    level: 1,
    header: 'Nonbinary Person',
    detail: person.nonBinaryPerson,
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

const getSummaryPerceivedUnhoused = person => {
  return {
    level: 1,
    header: 'Perceived Unhoused',
    detail: person.perceivedUnhoused,
  }
}

const getSummaryPassengerInVehicle = person => {
  return {
    level: 1,
    header: 'Passenger In Vehicle',
    detail: person.passengerInVehicle,
  }
}

const getSummaryInsideResidence = person => {
  return {
    level: 1,
    header: 'Inside Residence',
    detail: person.insideResidence,
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

const getSummaryReasonForStop = (person, statutes) => {
  const reasons = []
  reasons.push({
    detail: person.reasonForStop?.reason || null,
  })
  const listDetail = person.reasonForStop?.listDetail || []
  const keys = listDetail.map(item => {
    return {
      marginLeft: true,
      detail: item.reason,
    }
  })
  reasons.push(...keys)
  const listCodes = person.reasonForStop?.listCodes || []

  if (listCodes[0] !== null) {
    const codes = listCodes.map(code => {
      return {
        marginLeft: true,
        detail: code.text,
        repealed: statutes.find(s => s.code === Number(code.code))?.repealed,
      }
    })
    reasons.push(...codes)
  }

  return {
    level: 2,
    header: 'Reason for Stop',
    children: reasons,
  }
}

const getSummaryReasonForStopExplanation = person => {
  return {
    level: 1,
    header: 'Reason for Stop Explanation',
    detail: person.reasonForStopExplanation,
  }
}

const getSummaryReasonGivenForStop = person => {
  const reasons = person.reasonGivenForStop.map(obj => {
    return {
      detail: obj.reason,
    }
  })
  return {
    level: 2,
    header: 'Reason Given to Stopped Person',
    children: reasons,
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

  return {
    level: 2,
    header: 'Actions Taken During Stop',
    children: actions,
  }
}

const getSummaryNonForceActionsTaken = person => {
  const actions = person.listNonForceActionsTakenDuringStop
    .map(item => item.action)
    .map(item => {
      return {
        detail: item,
      }
    })

  return {
    level: 2,
    header: 'Non-Force Actions Taken During Stop',
    children: actions,
  }
}

const getSummaryForceActionsTaken = person => {
  const actions = person.listForceActionsTakenDuringStop
    .map(item => item.action)
    .map(item => {
      return {
        detail: item,
      }
    })

  return {
    level: 2,
    header: 'Force Actions Taken During Stop',
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
    detail: person.basisForSearchBrief || 'None',
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

const getSummaryResultOfStop = (person, statutes) => {
  const results = []
  for (let index = 0; index < person.listResultOfStop.length; index++) {
    const item = person.listResultOfStop[index]
    results.push({
      detail: item.result,
    })

    if (item.listCodes) {
      const codes = item.listCodes.map(code => {
        return {
          marginLeft: true,
          detail: code.text,
          repealed: statutes.find(s => s.code === Number(code.code))?.repealed,
        }
      })
      results.push(...codes)
    }
  }
  return {
    level: 2,
    header: 'Result of Stop',
    children: results,
  }
}

export const apiStopAgencyQuestionsSummary = apiStop => {
  const items = []
  const questions = apiStop.listAgencyQuestion || []

  if (questions && questions.length > 0) {
    let index = 0
    for (const item of questions) {
      items.push({
        id: `C${index}`,
        content: getSummaryAgencyQuestion(item.prompt, item.answer),
      })
      index = index + 1
    }
  }

  return items
}

const getSummaryAgencyQuestion = (question, answer) => {
  return {
    level: 1,
    header: question,
    detail: answer,
  }
}

export const apiStopTelemetrySummary = apiStop => {
  const items = []
  if (apiStop.telemetry) {
    items.push({
      id: 'D1',
      content: getSummaryTelemetryEditStopOfficerId(apiStop),
    })
    items.push({ id: 'D2', content: getSummaryTelemetryTemplate(apiStop) })
    items.push({
      id: 'D3',
      content: getSummaryTelemetryLookupCacheDate(apiStop),
    })
    items.push({
      id: 'D4',
      content: getSummaryTelemetryPullFromReasonCode(apiStop),
    })
    items.push({ id: 'D5', content: getSummaryTelemetryFormCached(apiStop) })
    items.push({ id: 'D6', content: getSummaryTelemetryStepTrace(apiStop) })
  }

  return items
}

const getSummaryTelemetryEditStopOfficerId = apiStop => {
  return {
    level: 1,
    header: 'Editing Officer ID',
    detail: apiStop.editStopOfficerId,
  }
}

const getSummaryTelemetryTemplate = apiStop => {
  return {
    level: 1,
    header: 'Template',
    detail: apiStop.telemetry.template,
  }
}

const getSummaryTelemetryLookupCacheDate = apiStop => {
  return {
    level: 1,
    header: 'Lookup Cache Date',
    detail: apiStop.telemetry.lookupCacheDate,
  }
}

const getSummaryTelemetryPullFromReasonCode = apiStop => {
  return {
    level: 1,
    header: 'Pull From Reason Code',
    detail: apiStop.telemetry.pullFromReasonCode,
  }
}

const getSummaryTelemetryFormCached = apiStop => {
  return {
    level: 1,
    header: 'Form Cached',
    detail: apiStop.telemetry.formCached,
  }
}

const getSummaryTelemetryStepTrace = apiStop => {
  const results = []
  for (let index = 0; index < apiStop.telemetry.listStepTrace.length; index++) {
    const item = apiStop.telemetry.listStepTrace[index]
    const stepIndex = item.index
    const startTimeStamp = format(
      new Date(item.startTimeStamp),
      'yyyy-MM-dd kk:mm:ss',
    )
    const endTimeStamp = format(
      new Date(item.endTimeStamp),
      'yyyy-MM-dd kk:mm:ss',
    )

    results.push({
      marginLeft: true,
      detail: `Step: ${stepIndex} / Start: ${startTimeStamp} / End: ${endTimeStamp}`,
    })
  }
  return {
    level: 2,
    header: 'Step Track',
    children: results,
  }
}

export const apiStopSubmissionSummary = submission => {
  const items = []
  if (submission) {
    items.push({ id: 'E1', content: getSummarySubmissionId(submission) })
    items.push({
      id: 'E2',
      content: getSummarySubmissionDateSubmitted(submission),
    })
    items.push({
      id: 'E3',
      content: getSummarySubmissionFileName(submission),
    })
    items.push({
      id: 'E4',
      content: getSummarySubmissionStatus(submission),
    })

    if (submission.listSubmissionError) {
      for (
        let index = 0;
        index < submission.listSubmissionError.length;
        index++
      ) {
        const errorElement = submission.listSubmissionError[index]
        items.push({
          id: `E5-${index}`,
          content: getSummarySubmissionError(errorElement, index),
        })
      }
    }
  }

  return items
}

const getSummarySubmissionId = submission => {
  return {
    level: 1,
    header: 'ID',
    detail: submission.id,
  }
}

const getSummarySubmissionDateSubmitted = submission => {
  return {
    level: 1,
    header: 'Date Submitted',
    detail: format(new Date(submission.dateSubmitted), 'yyyy-MM-dd kk:mm'),
  }
}

const getSummarySubmissionFileName = submission => {
  return {
    level: 1,
    header: 'File Name',
    detail: submission.fileName,
  }
}

const getSummarySubmissionStatus = submission => {
  return {
    level: 1,
    header: 'Status',
    detail: submission.status,
  }
}

const getSummarySubmissionError = (element, index) => {
  return {
    marginTop: true,
    level: 3,
    header: `Submission Error ${index + 1}`,
    children: [
      {
        header: 'Error Type',
        detail: element.errorType,
      },
      {
        header: 'Code',
        detail: element.code,
      },
      {
        header: 'Date Reported',
        detail: format(new Date(element.dateReported), 'yyyy-MM-dd kk:mm'),
      },
      { header: 'Message', detail: element.message },
    ],
  }
}

export const apiStopToFullStop = apiStop => {
  const blockNumber = apiStop.location?.blockNumber || null
  const streetName = apiStop.location?.streetName || null
  const schoolNumber = apiStop.location?.schoolName?.codes?.code || null
  const cityName = apiStop.location?.city?.codes?.code || null
  const beatNumber = apiStop.location?.beat?.codes?.code || null

  return {
    agencyQuestions: apiStop.listAgencyQuestion || [],
    id: apiStop.id,
    internalId: nanoid(),
    template: apiStop.telemetry?.template || null,
    stepTrace: apiStop.telemetry?.listStepTrace || [],
    isPiiFound: apiStop.isPiiFound || false,
    piiEntities: apiStop.piiEntities,
    stopVersion: apiStop.stopVersion || 1,
    location: {
      isSchool: apiStop.location?.school || false,
      school: schoolNumber,
      blockNumber: blockNumber && streetName ? blockNumber : null,
      streetName: blockNumber && streetName ? streetName : null,
      intersection: apiStop.location?.intersection || null,
      toggleLocationOptions: apiStop.location?.toggleLocationOptions || false,
      highwayExit: apiStop.location?.highwayExit || null,
      landmark: apiStop.location?.landMark || null,
      piiFound: apiStop.location?.piiFound || false,
      outOfCounty: apiStop.location?.outOfCounty || false,
      city: cityName || null,
      beat: beatNumber ? beatNumber.toString() : null,
      latitude: apiStop.location?.geoLocation?.latitude || null,
      longitude: apiStop.location?.geoLocation?.longitude || null,
    },
    stopDate: {
      date: apiStop.date,
      time: apiStop.time,
      duration: Number(apiStop.stopDuration),
      stopInResponseToCFS: apiStop.stopInResponseToCFS || false,
    },
    people: getFullStopPeopleListed(apiStop),
  }
}

export const apiStopToFullStopV2 = apiStop => {
  const blockNumber = apiStop.location?.blockNumber || null
  const streetName = apiStop.location?.streetName || null
  const schoolNumber = apiStop.location?.schoolName?.codes?.code || null
  const cityName = apiStop.location?.city?.codes?.code || null
  const beatNumber = apiStop.location?.beat?.codes?.code || null

  return {
    agencyQuestions: apiStop.listAgencyQuestion || [],
    id: apiStop.id,
    internalId: nanoid(),
    template: apiStop.telemetry?.template || null,
    stepTrace: apiStop.telemetry?.listStepTrace || [],
    isPiiFound: apiStop.isPiiFound || false,
    piiEntities: apiStop.piiEntities,
    stopType: apiStop.stopType,
    officerWorksWithNonReportingAgency:
      apiStop.officerWorksWithNonReportingAgency,
    stopVersion: apiStop.stopVersion,
    stopMadeDuringWelfareCheck: apiStop.stopMadeDuringWelfareCheck,
    lateSubmissionExplanation: apiStop.lateSubmissionExplanation || null,
    location: {
      isSchool: apiStop.location?.school || false,
      school: schoolNumber,
      blockNumber: blockNumber && streetName ? blockNumber : null,
      streetName: blockNumber && streetName ? streetName : null,
      crossStreet1: apiStop.location?.crossStreet1 || null,
      crossStreet2: apiStop.location?.crossStreet2 || null,
      toggleLocationOptions: apiStop.location?.toggleLocationOptions || false,
      highway: apiStop.location?.highway || null,
      exit: apiStop.location?.exit || null,
      landmark: apiStop.location?.landMark || null,
      piiFound: apiStop.location?.piiFound || false,
      outOfCounty: apiStop.location?.outOfCounty || false,
      city: cityName || null,
      beat: beatNumber ? beatNumber.toString() : null,
      latitude: apiStop.location?.geoLocation?.latitude || null,
      longitude: apiStop.location?.geoLocation?.longitude || null,
    },
    stopDate: {
      date: apiStop.date,
      time: apiStop.time,
      duration: Number(apiStop.stopDuration),
      stopInResponseToCFS: apiStop.stopInResponseToCFS || false,
    },
    people: getFullStopPeopleListedV2(apiStop),
  }
}

const getFullStopPeopleListed = apiStop => {
  const telemetry = apiStop.telemetry || null
  const people = apiStop.listPersonStopped

  return people.map((person, index) => {
    const anyDisabilities =
      person.listPerceivedOrKnownDisability.length > 0 &&
      person.listPerceivedOrKnownDisability[0].key !== '8'

    const anyActionsTaken =
      person.listActionTakenDuringStop.length > 0 &&
      person.listActionTakenDuringStop[0].key !== '24'

    const anyContraband =
      person.listContrabandOrEvidenceDiscovered.length > 0 &&
      person.listContrabandOrEvidenceDiscovered[0].key !== '1'

    const anyResultsOfStop =
      person.listResultOfStop.length > 0 &&
      person.listResultOfStop[0].key !== '1'

    const perceivedOrKnownDisability = anyDisabilities
      ? person.listPerceivedOrKnownDisability
      : []

    const actionTakenDuringStop = anyActionsTaken
      ? person.listActionTakenDuringStop
      : []

    const contrabandOrEvidenceDiscovered = anyContraband
      ? person.listContrabandOrEvidenceDiscovered
      : []

    const resultsOfStop = anyResultsOfStop ? person.listResultOfStop : []

    return {
      anyDisabilities,
      id: Number(person.id),
      index: index + 1,
      isStudent: person.isStudent || false,
      perceivedAge: Number(person.perceivedAge),
      perceivedGender: getPerceivedGenderCode(person),
      genderNonconforming: person.genderNonconforming,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish,
      perceivedLgbt: person.perceivedLgbt,
      perceivedOrKnownDisability: getKeyArray(perceivedOrKnownDisability),
      perceivedRace: getKeyArray(person.listPerceivedRace),
      actionsTaken: {
        anyActionsTaken,
        actionsTakenDuringStop: getKeyArray(actionTakenDuringStop),
        personSearchConsentGiven: person.personSearchConsentGiven,
        propertySearchConsentGiven: person.propertySearchConsentGiven,
        basisForSearch: getKeyArray(person.listBasisForSearch),
        basisForSearchExplanation: person.basisForSearchBrief,
        basisForSearchPiiFound: person.basisForSearchPiiFound || false,
        propertyWasSeized:
          person.listBasisForPropertySeizure.length > 0 ||
          person.listTypeOfPropertySeized.length > 0,
        basisForPropertySeizure: getKeyArray(
          person.listBasisForPropertySeizure,
        ),
        typeOfPropertySeized: getKeyArray(person.listTypeOfPropertySeized),
        anyContraband,
        contrabandOrEvidenceDiscovered: getKeyArray(
          contrabandOrEvidenceDiscovered,
        ),
      },
      stopReason: {
        reasonForStop: Number(person.reasonForStop.key),
        educationViolation: getEducationViolationDetailKey(
          person.reasonForStop,
        ),
        educationViolationCode: getEducationViolationDetailCode(
          person.reasonForStop,
        ),
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
        reasonForStopExplanation: person.reasonForStopExplanation,
        reasonForStopPiiFound: person.reasonForStopPiiFound || false,
        searchOfPerson: getStopReasonSearchOfPerson(person),
        searchOfProperty: getStopReasonSearchOfProperty(person),
      },
      stopResult: {
        anyResultsOfStop,
        resultsOfStop2: getKeyFoundInArray(resultsOfStop, 2),
        resultsOfStop3: getKeyFoundInArray(resultsOfStop, 3),
        resultsOfStop4: getKeyFoundInArray(resultsOfStop, 4),
        resultsOfStop5: getKeyFoundInArray(resultsOfStop, 5),
        resultsOfStop6: getKeyFoundInArray(resultsOfStop, 6),
        resultsOfStop7: getKeyFoundInArray(resultsOfStop, 7),
        resultsOfStop8: getKeyFoundInArray(resultsOfStop, 8),
        resultsOfStop9: getKeyFoundInArray(resultsOfStop, 9),
        resultsOfStop10: getKeyFoundInArray(resultsOfStop, 10),
        resultsOfStop11: getKeyFoundInArray(resultsOfStop, 11),
        resultsOfStop12: getKeyFoundInArray(resultsOfStop, 12),
        resultsOfStop13: getKeyFoundInArray(resultsOfStop, 13),
        warningCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 2),
        citationCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 3),
        infieldCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 4),
        custodialArrestCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 6),
        pullFromReasonCode: telemetry?.pullFromReasonCode || false,
      },
    }
  })
}

const getFullStopPeopleListedV2 = apiStop => {
  const telemetry = apiStop.telemetry || null
  const people = apiStop.listPersonStopped

  return people.map((person, index) => {
    const anyDisabilities =
      person.listPerceivedOrKnownDisability.length > 0 &&
      person.listPerceivedOrKnownDisability[0].key !== '8'

    const anyNonForceActionsTaken =
      person.listNonForceActionsTakenDuringStop.length > 0 &&
      person.listNonForceActionsTakenDuringStop[0].key !== '18'

    const anyForceActionsTaken =
      person.listForceActionsTakenDuringStop.length > 0 &&
      person.listForceActionsTakenDuringStop[0].key !== '18'

    const anyContraband =
      person.listContrabandOrEvidenceDiscovered.length > 0 &&
      person.listContrabandOrEvidenceDiscovered[0].key !== '1'

    const anyResultsOfStop =
      person.listResultOfStop.length > 0 &&
      person.listResultOfStop[0].key !== '1'

    const perceivedOrKnownDisability = anyDisabilities
      ? person.listPerceivedOrKnownDisability
      : []

    const nonForceActionsTakenDuringStop = anyNonForceActionsTaken
      ? person.listNonForceActionsTakenDuringStop
      : []

    const forceActionsTakenDuringStop = anyForceActionsTaken
      ? person.listForceActionsTakenDuringStop
      : []

    const contrabandOrEvidenceDiscovered = anyContraband
      ? person.listContrabandOrEvidenceDiscovered
      : []

    const resultsOfStop = anyResultsOfStop ? person.listResultOfStop : []

    return {
      anyDisabilities,
      id: Number(person.id),
      index: index + 1,
      isStudent: person.isStudent || false,
      perceivedAge: Number(person.perceivedAge),
      perceivedGender: getPerceivedGenderCodeV2(person),
      nonBinaryPerson: person.nonBinaryPerson,
      perceivedSexualOrientation: getPerceivedOrientationCode(person),
      passengerInVehicle: person.passengerInVehicle,
      insideResidence: person.insideResidence,
      perceivedUnhoused: person.perceivedUnhoused,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish,
      perceivedOrKnownDisability: getKeyArray(perceivedOrKnownDisability),
      perceivedRace: getKeyArray(person.listPerceivedRace),
      nonForceActionsTaken: {
        anyNonForceActionsTaken,
        nonForceActionsTakenDuringStop: getKeyArray(
          nonForceActionsTakenDuringStop,
        ),
        personSearchConsentGiven: person.personSearchConsentGiven,
        propertySearchConsentGiven: person.propertySearchConsentGiven,
        basisForSearch: getKeyArray(person.listBasisForSearch),
        basisForSearchExplanation: person.basisForSearchBrief,
        basisForSearchPiiFound: person.basisForSearchPiiFound || false,
        propertyWasSeized:
          person.listBasisForPropertySeizure.length > 0 ||
          person.listTypeOfPropertySeized.length > 0,
        basisForPropertySeizure: getKeyArray(
          person.listBasisForPropertySeizure,
        ),
        typeOfPropertySeized: getKeyArray(person.listTypeOfPropertySeized),
        anyContraband,
        contrabandOrEvidenceDiscovered: getKeyArray(
          contrabandOrEvidenceDiscovered,
        ),
      },
      forceActionsTaken: {
        anyForceActionsTaken,
        forceActionsTakenDuringStop: getKeyArray(forceActionsTakenDuringStop),
      },
      stopReason: {
        reasonForStop: Number(person.reasonForStop.key),
        reasonGivenForStop: getKeyArray(person.reasonGivenForStop),
        educationViolation: getEducationViolationDetailKey(
          person.reasonForStop,
        ),
        educationViolationCode: getEducationViolationDetailCode(
          person.reasonForStop,
        ),
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
        probableCause: getProbableCauseDetailKeys(person.reasonForStop),
        probableCauseCode: getProbableCauseDetailCode(person.reasonForStop),
        reasonForStopExplanation: person.reasonForStopExplanation,
        reasonForStopPiiFound: person.reasonForStopPiiFound || false,
        searchOfPerson: getStopReasonSearchOfPersonV2(person),
        searchOfProperty: getStopReasonSearchOfPropertyV2(person),
      },
      stopResult: {
        anyResultsOfStop,
        resultsOfStop3: getKeyFoundInArray(resultsOfStop, 3),
        resultsOfStop4: getKeyFoundInArray(resultsOfStop, 4),
        resultsOfStop5: getKeyFoundInArray(resultsOfStop, 5),
        resultsOfStop6: getKeyFoundInArray(resultsOfStop, 6),
        resultsOfStop7: getKeyFoundInArray(resultsOfStop, 7),
        resultsOfStop8: getKeyFoundInArray(resultsOfStop, 8),
        resultsOfStop9: getKeyFoundInArray(resultsOfStop, 9),
        resultsOfStop10: getKeyFoundInArray(resultsOfStop, 10),
        resultsOfStop11: getKeyFoundInArray(resultsOfStop, 11),
        resultsOfStop12: getKeyFoundInArray(resultsOfStop, 12),
        resultsOfStop13: getKeyFoundInArray(resultsOfStop, 13),
        resultsOfStop14: getKeyFoundInArray(resultsOfStop, 14),
        resultsOfStop15: getKeyFoundInArray(resultsOfStop, 15),
        verbalWarningCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 14),
        writtenWarningCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 15),
        citationCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 3),
        infieldCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 4),
        custodialArrestCodes: getCodePropValueGivenKeyInArray(resultsOfStop, 6),
        pullFromReasonCode: telemetry?.pullFromReasonCode || false,
      },
    }
  })
}

const getStopReasonSearchOfPerson = person => {
  const reasonForStop = Number(person.reasonForStop.key)
  const anyActionsTaken =
    person.listActionTakenDuringStop.length > 0 &&
    person.listActionTakenDuringStop[0].key !== '24'
  const actionsTaken = person.listActionTakenDuringStop || []
  const mappedActionsTaken = actionsTaken.map(item => Number(item.key))

  if (reasonForStop === 6) {
    if (anyActionsTaken) {
      if (mappedActionsTaken.includes(18)) {
        return true
      }
    }
  }

  return false
}

const getStopReasonSearchOfPersonV2 = person => {
  const reasonForStop = Number(person.reasonForStop.key)
  const anyActionsTaken =
    person.listNonForceActionsTakenDuringStop.length > 0 &&
    person.listNonForceActionsTakenDuringStop[0].key !== '24'
  const actionsTaken = person.listNonForceActionsTakenDuringStop || []
  const mappedActionsTaken = actionsTaken.map(item => Number(item.key))

  if (reasonForStop === 6) {
    if (anyActionsTaken) {
      if (mappedActionsTaken.includes(14)) {
        return true
      }
    }
  }

  return false
}

const getStopReasonSearchOfProperty = person => {
  const reasonForStop = Number(person.reasonForStop.key)
  const anyActionsTaken =
    person.listActionTakenDuringStop.length > 0 &&
    person.listActionTakenDuringStop[0].key !== '24'
  const actionsTaken = person.listActionTakenDuringStop || []
  const mappedActionsTaken = actionsTaken.map(item => Number(item.key))

  if (reasonForStop === 6) {
    if (anyActionsTaken) {
      if (mappedActionsTaken.includes(20)) {
        return true
      }
    }
  }

  return false
}

const getStopReasonSearchOfPropertyV2 = person => {
  const reasonForStop = Number(person.reasonForStop.key)
  const anyActionsTaken =
    person.listNonForceActionsTakenDuringStop.length > 0 &&
    person.listNonForceActionsTakenDuringStop[0].key !== '24'
  const actionsTaken = person.listNonForceActionsTakenDuringStop || []
  const mappedActionsTaken = actionsTaken.map(item => Number(item.key))

  if (reasonForStop === 6) {
    if (anyActionsTaken) {
      if (mappedActionsTaken.includes(15)) {
        return true
      }
    }
  }

  return false
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

const getProbableCauseDetailKeys = stopReason => {
  if (stopReason.key && Number(stopReason.key) === 9) {
    return stopReason.listDetail.map(item => Number(item.key))
  }

  return null
}

const getProbableCauseDetailCode = stopReason => {
  if (
    stopReason.key &&
    Number(stopReason.key) === 9 &&
    stopReason.listCodes[0]
  ) {
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
    const listCodes = stopReason.listCodes || []
    if (listCodes.length > 0) {
      return Number(stopReason.listCodes[0].code)
    }
  }

  return []
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

const getKeyArray = items => {
  return items.map(item => Number(item.key))
}

export const fullStopToStop = fullStop => {
  const person = fullStop.people.length > 0 ? fullStop.people[0] : null
  return {
    id: fullStop.id,
    internalId: fullStop.id,
    template: fullStop.template,
    editStopExplanation: null,
    isPiiFound: fullStop.isPiiFound || false,
    overridePii: false,
    piiEntities: fullStop.piiEntities,
    stepTrace: fullStop.stepTrace,
    actionsTaken: person.actionsTaken || {},
    location: fullStop.location,
    stopVersion: fullStop.stopVersion,
    person: {
      anyDisabilities: person.anyDisabilities || false,
      genderNonconforming: person.genderNonconforming || false,
      id: person.id,
      isStudent: person.isStudent || false,
      perceivedAge: person.perceivedAge || null,
      perceivedGender: person.perceivedGender || null,
      perceivedLgbt: person.perceivedLgbt,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish || false,
      perceivedOrKnownDisability: person.perceivedOrKnownDisability || [],
      perceivedRace: person.perceivedRace || [],
    },
    stopDate: fullStop.stopDate,
    stopReason: person.stopReason || {},
    stopResult: person.stopResult || {},
    agencyQuestions: fullStop.agencyQuestions,
  }
}

export const fullStopToStopV2 = fullStop => {
  const person = fullStop.people.length > 0 ? fullStop.people[0] : null
  return {
    id: fullStop.id,
    internalId: fullStop.id,
    template: fullStop.template,
    editStopExplanation: null,
    isPiiFound: fullStop.isPiiFound || false,
    overridePii: false,
    piiEntities: fullStop.piiEntities,
    stepTrace: fullStop.stepTrace,
    nonForceActionsTaken: person.nonForceActionsTaken,
    forceActionsTaken: person.forceActionsTaken,
    location: fullStop.location,
    stopType: fullStop.stopType,
    officerWorksWithNonReportingAgency:
      fullStop.officerWorksWithNonReportingAgency,
    stopVersion: fullStop.stopVersion,
    stopMadeDuringWelfareCheck: fullStop.stopMadeDuringWelfareCheck,
    person: {
      anyDisabilities: person.anyDisabilities || false,
      nonBinaryPerson: person.nonBinaryPerson || false,
      id: person.id,
      isStudent: person.isStudent || false,
      perceivedAge: person.perceivedAge || null,
      perceivedGender: person.perceivedGender || null,
      perceivedSexualOrientation: person.perceivedSexualOrientation,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish || false,
      perceivedUnhoused: person.perceivedUnhoused,
      passengerInVehicle: person.passengerInVehicle,
      insideResidence: person.insideResidence,
      perceivedOrKnownDisability: person.perceivedOrKnownDisability || [],
      perceivedRace: person.perceivedRace || [],
    },
    stopDate: fullStop.stopDate,
    stopReason: person.stopReason || {},
    stopResult: person.stopResult || {},
    agencyQuestions: fullStop.agencyQuestions,
    lateSubmissionExplanation: fullStop.lateSubmissionExplanation || null,
  }
}

export const getOfficerFromLocalStorage = () => {
  const officer = localStorage.getItem('ripa_officer')
  return officer ? JSON.parse(officer) : null
}

export const fullStopToApiStop = (
  onlineAndAuthenticated,
  fullStop,
  beats,
  countyCities,
  nonCountyCities,
  schools,
  statutes,
) => {
  if (!fullStop) {
    return {}
  }

  if (fullStop && Object.keys(fullStop).length === 0) {
    return {}
  }

  const officer = getOfficerFromLocalStorage()
  const assignment = getOfficerAssignment(officer.assignment)
  const outOfCounty = fullStop.location?.outOfCounty || false
  const duration = fullStop.stopDate?.duration || null
  const lookupCacheDate = localStorage.getItem('ripa_cache_date')
  const formCached = localStorage.getItem('ripa_form_cached')
  const submittedApiStop = localStorage.getItem('ripa_form_submitted_api_stop')
  const parsedApiStop = submittedApiStop ? JSON.parse(submittedApiStop) : null
  const blockNumber = fullStop.location?.blockNumber || null
  const streetName = fullStop.location?.streetName || null

  return {
    agency: parsedApiStop ? parsedApiStop.agency : officer.agency,
    date: fullStop.stopDate.date,
    editStopExplanation: parsedApiStop ? fullStop.editStopExplanation : null,
    editStopOfficerId: parsedApiStop ? officer.officerId : null,
    expYears: parsedApiStop
      ? parsedApiStop.expYears
      : officer.yearsExperience?.toString() || '',
    id: fullStop.id,
    telemetry: {
      offline: !onlineAndAuthenticated,
      template: fullStop.template || null,
      formCached: formCached === '1',
      listStepTrace: fullStop.stepTrace,
      lookupCacheDate:
        parsedApiStop && parsedApiStop.telemetry
          ? parsedApiStop.telemetry.lookupCacheDate
          : lookupCacheDate
          ? format(new Date(lookupCacheDate), 'yyyy-MM-dd kk:mm')
          : null,
      pullFromReasonCode:
        fullStop.people.filter(item => item.pullFromReasonCode).length > 0,
    },
    listAgencyQuestion: fullStop.agencyQuestions || [],
    isPiiFound: getPiiFound(parsedApiStop, fullStop, onlineAndAuthenticated),
    overridePii: fullStop.overridePii || false,
    piiEntities: fullStop.piiEntities,
    listPersonStopped: getApiStopPeopleListed(fullStop, statutes),
    location: {
      beat: getBeat(fullStop, beats),
      blockNumber: blockNumber && streetName ? blockNumber : '',
      city: getCity(fullStop, outOfCounty ? nonCountyCities : countyCities),
      fullAddress: fullStop.location?.fullAddress || '',
      highwayExit: fullStop.location?.highwayExit || '',
      intersection: fullStop.location?.intersection || '',
      landMark: fullStop.location?.landmark || '',
      outOfCounty,
      piiFound: fullStop.location?.piiFound || false,
      school: fullStop.location?.isSchool || false,
      schoolName: getSchool(fullStop, schools),
      streetName: blockNumber && streetName ? streetName : '',
      toggleLocationOptions: fullStop.location?.toggleLocationOptions || false,
      geoLocation: {
        latitude: fullStop.location?.latitude || null,
        longitude: fullStop.location?.longitude || null,
      },
    },
    officerAssignment: {
      key: parsedApiStop
        ? parsedApiStop.officerAssignment.key
        : assignment.code.toString(),
      otherType: parsedApiStop
        ? parsedApiStop.officerAssignment.otherType
        : officer?.otherType || '',
      type: parsedApiStop
        ? parsedApiStop.officerAssignment.type
        : assignment.text,
    },
    officerId: parsedApiStop ? parsedApiStop.officerId : officer.officerId,
    officerName: parsedApiStop
      ? parsedApiStop.officerName
      : officer.officerName,
    stopDateTime: new Date(
      formatDateTime(fullStop.stopDate.date, fullStop.stopDate.time),
    ),
    stopDuration: duration ? duration.toString() : null,
    stopInResponseToCFS: fullStop.stopDate?.stopInResponseToCFS || false,
    time: fullStop.stopDate.time,
    stopVersion: fullStop.stopVersion,
    nfia: fullStop.nfia,
    lateSubmissionExplanation: fullStop.lateSubmissionExplanation || null,
  }
}

export const fullStopToApiStopV2 = (
  onlineAndAuthenticated,
  fullStop,
  beats,
  countyCities,
  nonCountyCities,
  schools,
  statutes,
) => {
  if (!fullStop) {
    return {}
  }

  if (fullStop && Object.keys(fullStop).length === 0) {
    return {}
  }

  const officer = getOfficerFromLocalStorage()
  const assignment = getOfficerAssignment(officer.assignment)
  const outOfCounty = fullStop.location?.outOfCounty || false
  const duration = fullStop.stopDate?.duration || null
  const lookupCacheDate = localStorage.getItem('ripa_cache_date')
  const formCached = localStorage.getItem('ripa_form_cached')
  const submittedApiStop = localStorage.getItem('ripa_form_submitted_api_stop')
  const parsedApiStop = submittedApiStop ? JSON.parse(submittedApiStop) : null

  return {
    agency: parsedApiStop ? parsedApiStop.agency : officer.agency,
    date: fullStop.stopDate.date,
    editStopExplanation: parsedApiStop ? fullStop.editStopExplanation : null,
    editStopOfficerId: parsedApiStop ? officer.officerId : null,
    expYears: parsedApiStop
      ? parsedApiStop.expYears
      : officer.yearsExperience?.toString() || '',
    id: fullStop.id,
    telemetry: {
      offline: !onlineAndAuthenticated,
      template: fullStop.template || null,
      formCached: formCached === '1',
      listStepTrace: fullStop.stepTrace,
      lookupCacheDate:
        parsedApiStop && parsedApiStop.telemetry
          ? parsedApiStop.telemetry.lookupCacheDate
          : lookupCacheDate
          ? format(new Date(lookupCacheDate), 'yyyy-MM-dd kk:mm')
          : null,
      pullFromReasonCode:
        fullStop.people.filter(item => item.pullFromReasonCode).length > 0,
    },
    listAgencyQuestion: fullStop.agencyQuestions || [],
    isPiiFound: getPiiFound(parsedApiStop, fullStop, onlineAndAuthenticated),
    overridePii: fullStop.overridePii || false,
    piiEntities: fullStop.piiEntities,
    listPersonStopped: getApiStopPeopleListedV2(fullStop, statutes),
    location: {
      beat: getBeat(fullStop, beats),
      blockNumber: fullStop.location?.blockNumber || '',
      city: getCity(fullStop, outOfCounty ? nonCountyCities : countyCities),
      fullAddress: fullStop.location?.fullAddress || '',
      highway: fullStop.location?.highway || '',
      exit: fullStop.location?.exit || '',
      crossStreet1: fullStop.location?.crossStreet1 || '',
      crossStreet2: fullStop.location?.crossStreet2 || '',
      landMark: fullStop.location?.landmark || '',
      outOfCounty,
      piiFound: fullStop.location?.piiFound || false,
      school: fullStop.location?.isSchool || false,
      schoolName: getSchool(fullStop, schools),
      streetName: fullStop.location?.streetName || '',
      toggleLocationOptions: fullStop.location?.toggleLocationOptions || false,
      geoLocation: {
        latitude: fullStop.location?.latitude || null,
        longitude: fullStop.location?.longitude || null,
      },
    },
    officerAssignment: {
      key: parsedApiStop
        ? parsedApiStop.officerAssignment.key
        : assignment.code.toString(),
      otherType: parsedApiStop
        ? parsedApiStop.officerAssignment.otherType
        : officer?.otherType || '',
      type: parsedApiStop
        ? parsedApiStop.officerAssignment.type
        : assignment.text,
    },
    officerId: parsedApiStop ? parsedApiStop.officerId : officer.officerId,
    officerName: parsedApiStop
      ? parsedApiStop.officerName
      : officer.officerName,
    officerRace: parsedApiStop
      ? parsedApiStop.officerRace
      : officer.officerRace,
    officerGender: parsedApiStop
      ? parsedApiStop.officerGender
      : officer.officerGender,
    officerNonBinary: parsedApiStop
      ? parsedApiStop.officerNonBinary
      : officer.officerNonBinary,
    officerWorksWithNonReportingAgency:
      fullStop.officerWorksWithNonReportingAgency,
    stopDateTime: new Date(
      formatDateTime(fullStop.stopDate.date, fullStop.stopDate.time),
    ),
    stopDuration: duration ? duration.toString() : null,
    stopInResponseToCFS: fullStop.stopDate?.stopInResponseToCFS || false,
    stopMadeDuringWelfareCheck: fullStop.stopMadeDuringWelfareCheck || false,
    time: fullStop.stopDate.time,
    stopVersion: fullStop.stopVersion,
    stopType: fullStop.stopType,
    nfia: fullStop.nfia,
    favoriteLocationName: fullStop.favoriteLocationName,
    favoriteReasonName: fullStop.favoriteReasonName,
    favoriteResultName: fullStop.favoriteResultName,
    lateSubmissionExplanation: fullStop.lateSubmissionExplanation || null,
  }
}

export const getApiStopPeopleListed = (fullStop, statutes) => {
  return fullStop.people.map((person, index) => {
    return {
      basisForSearchBrief:
        person.actionsTaken?.basisForSearchExplanation || null,
      basisForSearchPiiFound:
        person.actionsTaken?.basisForSearchPiiFound || false,
      genderNonconforming: person.genderNonconforming || false,
      id: index + 1,
      index: index + 1,
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
      perceivedLgbt: person.perceivedLgbt,
      perceivedLimitedEnglish: person.perceivedLimitedEnglish || false,
      personSearchConsentGiven:
        person.actionsTaken?.personSearchConsentGiven || false,
      propertySearchConsentGiven:
        person.actionsTaken?.propertySearchConsentGiven || false,
      reasonForStop: getReasonForStop(person, statutes),
      reasonForStopExplanation:
        person.stopReason?.reasonForStopExplanation || null,
      reasonForStopPiiFound: person.stopReason?.reasonForStopPiiFound || false,
    }
  })
}

export const getApiStopPeopleListedV2 = (fullStop, statutes) => {
  return fullStop.people.map((person, index) => {
    return {
      basisForSearchBrief:
        person.nonForceActionsTaken?.basisForSearchExplanation || null,
      basisForSearchPiiFound:
        person.nonForceActionsTaken?.basisForSearchPiiFound || false,
      id: index + 1,
      index: index + 1,
      isStudent: person.isStudent || false,
      listNonForceActionsTakenDuringStop:
        getNonForceActionsTakenDuringStop(person),
      listForceActionsTakenDuringStop: getForceActionsTakenDuringStop(person),
      listBasisForPropertySeizure: getBasisForPropertySeizureV2(person),
      listBasisForSearch: getBasisForSearchV2(person),
      listContrabandOrEvidenceDiscovered:
        getContrabandOrEvidenceDiscoveredV2(person),
      listPerceivedOrKnownDisability: getPerceivedOrKnownDisability(person),
      listPerceivedRace: getPerceivedRaceV2(person),
      listResultOfStop: getResultOfStopV2(person, statutes),
      listTypeOfPropertySeized: getTypeOfPropertySeizedV2(person),
      perceivedAge: person.perceivedAge?.toString() || null,
      perceivedGender: getPerceivedGenderTextV2(person),
      nonBinaryPerson: person.nonBinaryPerson || false,
      perceivedSexualOrientation: getPerceivedOrientationText(person),
      perceivedLimitedEnglish: person.perceivedLimitedEnglish || false,
      perceivedUnhoused: person.perceivedUnhoused,
      personSearchConsentGiven:
        person.nonForceActionsTaken?.personSearchConsentGiven || false,
      propertySearchConsentGiven:
        person.nonForceActionsTaken?.propertySearchConsentGiven || false,
      reasonForStop: getReasonForStopV2(person, statutes),
      reasonGivenForStop: getReasonGivenForStopV2(person, statutes),
      passengerInVehicle: person.passengerInVehicle,
      insideResidence: person.insideResidence,
      reasonForStopExplanation:
        person.stopReason?.reasonForStopExplanation || null,
      reasonForStopPiiFound: person.stopReason?.reasonForStopPiiFound || false,
    }
  })
}

const getPiiFound = (parsedApiStop, fullStop) => {
  if (parsedApiStop && (fullStop.overridePii || parsedApiStop.overridePii)) {
    return false
  }

  const stopPiiFound = fullStop.isPiiFound
  const locationPiiFound = fullStop.location?.piiFound || false
  const people = fullStop.people || []
  let reasonForStopPiiFound = false
  let basisForSearchPiiFound = false

  for (let index = 0; index < people.length; index++) {
    const person = people[index]
    if (!reasonForStopPiiFound && !basisForSearchPiiFound) {
      reasonForStopPiiFound = person.stopReason?.reasonForStopPiiFound || false
      if (fullStop.stopVersion === 1) {
        basisForSearchPiiFound =
          person.actionsTaken?.basisForSearchPiiFound || false
      } else if (fullStop.stopVersion === 2) {
        basisForSearchPiiFound =
          person.nonForceActionsTaken?.basisForSearchPiiFound || false
      }
    }
  }

  return (
    stopPiiFound ||
    locationPiiFound ||
    reasonForStopPiiFound ||
    basisForSearchPiiFound
  )
}

export const getOfficerAssignment = assignment => {
  const [filteredAssignment] = OFFICER_ASSIGNMENTS.filter(
    item => item.value === assignment,
  )

  return {
    code: assignment.toString(),
    text: filteredAssignment?.name || '',
  }
}

export const getOfficerAssignmentV2 = assignment => {
  const [filteredAssignment] = OFFICER_ASSIGNMENTS_V2.filter(
    item => item.value === assignment,
  )

  return {
    code: assignment.toString(),
    text: filteredAssignment?.name || '',
  }
}

const getSchool = (fullStop, schools) => {
  const school = fullStop.location?.school || null

  if (school) {
    const [filteredSchool] = schools.filter(
      item => item.cdsCode.toString() === school.toString(),
    )
    return {
      codes: {
        code: school.toString(),
        text: filteredSchool?.fullName || '',
      },
    }
  }

  return null
}

const getCity = (fullStop, cities) => {
  const city = fullStop.location?.city || null

  if (city) {
    const [filteredCity] = cities.filter(
      item => item.id.toString() === city.toString(),
    )
    return {
      codes: {
        code: city.toString(),
        text: filteredCity?.fullName || '',
      },
    }
  }

  return null
}

const getBeat = (fullStop, beats) => {
  const beat = fullStop.location?.beat || null

  if (beat) {
    const [filteredBeat] = beats.filter(
      item => item.id.toString() === beat.toString(),
    )
    return {
      codes: {
        code: beat.toString(),
        text: filteredBeat?.fullName || '',
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
      race: filteredRace?.name || '',
    }
  })
}

const getPerceivedRaceV2 = person => {
  const race = person.perceivedRace || []

  return race.map(item => {
    const [filteredRace] = RACES_V2.filter(item2 => item2.value === item)

    return {
      key: item.toString(),
      race: filteredRace?.name || '',
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
      code: filteredGender?.value || null,
      text: filteredGender?.name || '',
    }
  }

  return null
}

const getPerceivedGenderV2 = person => {
  const gender = person.perceivedGender || null
  if (gender) {
    const [filteredGenderValue] = PERSON_GENDERS_V2.filter(
      item => item.value === gender,
    )
    const [filteredGenderName] = PERSON_GENDERS_V2.filter(
      item => item.name === gender,
    )
    const filteredGender = filteredGenderValue || filteredGenderName

    return {
      code: filteredGender?.value || null,
      text: filteredGender?.name || '',
    }
  }

  return null
}

const getPerceivedOrientation = person => {
  const orientation = person.perceivedSexualOrientation || null
  if (orientation) {
    const [filteredOrientationValue] = SEXUAL_ORIENTATIONS.filter(
      item => item.value === orientation,
    )
    const [filteredOrientationName] = SEXUAL_ORIENTATIONS.filter(
      item => item.name === orientation,
    )
    const filteredOrientation =
      filteredOrientationValue || filteredOrientationName

    return {
      code: filteredOrientation?.value || null,
      text: filteredOrientation?.name || '',
    }
  }
}

const getPerceivedGenderCode = person => {
  const gender = getPerceivedGender(person)
  return gender?.code || null
}

const getPerceivedGenderCodeV2 = person => {
  const gender = getPerceivedGenderV2(person)
  return gender?.code || null
}

const getPerceivedOrientationCode = person => {
  const orientation = getPerceivedOrientation(person)
  return orientation?.code || null
}

const getPerceivedGenderText = person => {
  const gender = getPerceivedGender(person)
  return gender?.text || ''
}

const getPerceivedGenderTextV2 = person => {
  const gender = getPerceivedGenderV2(person)
  return gender?.text || ''
}

const getPerceivedOrientationText = person => {
  const orientation = getPerceivedOrientation(person)
  return orientation?.text || null
}

const getPerceivedOrKnownDisability = person => {
  const disability = person.perceivedOrKnownDisability || []

  const mappedItems = disability.map(item => {
    const [filteredDisability] = DISABILITIES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      disability: filteredDisability?.name || '',
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
      reason: filteredReason?.name || '',
      listDetail: getReasonForStopDetails(reason, person),
      listCodes: getReasonForStopCodes(reason, person, statutes),
    }
  }

  return null
}

const getReasonForStopV2 = (person, statutes) => {
  const reason = person.stopReason?.reasonForStop || null

  if (reason) {
    const [filteredReason] = STOP_REASONS_V2.filter(
      item => item.value === reason,
    )
    return {
      key: reason.toString(),
      reason: filteredReason?.name || '',
      listDetail: getReasonForStopDetailsV2(reason, person),
      listCodes: getReasonForStopCodes(reason, person, statutes),
    }
  }

  return null
}

const getReasonGivenForStopV2 = person => {
  const reasons = person.stopReason?.reasonGivenForStop || []

  if (reasons.length > 0) {
    const selectedReasons = reasons.map(reason => {
      const [filteredReason] = GIVEN_STOP_REASONS_V2.filter(
        item => item.value === reason,
      )
      return {
        key: reason.toString(),
        reason: filteredReason?.name || '',
      }
    })
    return selectedReasons
  } else {
    return null
  }
}

const getReasonForStopDetails = (reasonKey, person) => {
  if (reasonKey === 1) {
    return [getTrafficViolation(person)]
  }
  if (reasonKey === 2) {
    return getReasonableSuspicion(person)
  }
  if (reasonKey === 7) {
    return [getEducationViolation(person)]
  }
  if (reasonKey === 9) {
    return [getEducationViolation(person)]
  }

  return []
}

const getReasonForStopDetailsV2 = (reasonKey, person) => {
  if (reasonKey === 1) {
    return [getTrafficViolation(person)]
  }
  if (reasonKey === 2) {
    return getReasonableSuspicionV2(person)
  }
  if (reasonKey === 7) {
    return [getEducationViolation(person)]
  }
  if (reasonKey === 9) {
    return getProbableCause(person)
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
    const educationViolationCode =
      person.stopReason?.educationViolationCode || null
    if (educationViolationCode) {
      return [getEducationViolationCode(person)]
    } else {
      return []
    }
  }
  if (reasonKey === 9) {
    return [getProbableCauseCode(person, statutes)]
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
      reason: filteredViolation?.name || '',
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
      reason: filteredViolation?.name || '',
    }
  }

  return null
}

const getStatute = (code, statutes) => {
  if (code) {
    const [filteredStatute] = statutes.filter(item => item.code === code)

    return {
      code: code.toString(),
      text: filteredStatute?.fullName || '',
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
      text: filteredSubsection?.fullName || '',
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
  const suspicion = person.stopReason?.reasonableSuspicion || []
  return suspicion.map(item => {
    const [filteredSuspicion] = REASONABLE_SUSPICIONS.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      reason: filteredSuspicion?.name || '',
    }
  })
}

const getReasonableSuspicionV2 = person => {
  const suspicion = person.stopReason?.reasonableSuspicion || []
  return suspicion.map(item => {
    const [filteredSuspicion] = REASONABLE_SUSPICIONS_V2.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      reason: filteredSuspicion?.name || '',
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

const getProbableCause = person => {
  const probableCause = person.stopReason?.probableCause || []
  return probableCause.map(item => {
    const [filteredProbableCause] = PROBABLE_CAUSES.filter(
      item2 => item2.value === item,
    )
    return {
      key: item.toString(),
      reason: filteredProbableCause?.name || '',
    }
  })
}

const getProbableCauseCode = (person, statutes) => {
  const code = person.stopReason?.probableCauseCode || null
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
      action: filteredAction?.name || '',
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

const getNonForceActionsTakenDuringStop = person => {
  const actions =
    person.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []
  const mappedItems = actions.map(item => {
    const [filteredAction] = NON_FORCE_ACTIONS_TAKEN.filter(
      item2 => item2.value === item,
    )

    const action = {
      key: item.toString(),
      action: filteredAction?.name || '',
    }

    return action
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '18',
      action: 'None',
    },
  ]
}

const getForceActionsTakenDuringStop = person => {
  const actions = person.forceActionsTaken?.forceActionsTakenDuringStop || []

  const mappedItems = actions.map(item => {
    const [filteredAction] = FORCE_ACTIONS_TAKEN.filter(
      item2 => item2.value === item,
    )

    const action = { key: item.toString(), action: filteredAction?.name || '' }

    return action
  })

  if (mappedItems.length > 0) {
    return mappedItems
  }

  return [
    {
      key: '18',
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
      basis: filteredBasis?.name || '',
    }
  })
}

const getBasisForSearchV2 = person => {
  const basis = person.nonForceActionsTaken?.basisForSearch || []

  return basis.map(item => {
    const [filteredBasis] = BASIS_FOR_SEARCH_V2.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      basis: filteredBasis?.name || '',
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
      basis: filteredBasis?.name || '',
    }
  })
}

const getBasisForPropertySeizureV2 = person => {
  const basis = person.nonForceActionsTaken?.basisForPropertySeizure || []

  return basis.map(item => {
    const [filteredBasis] = BASIS_FOR_PROPERTY_SEIZURE.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      basis: filteredBasis?.name || '',
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
      type: filteredType?.name || '',
    }
  })
}

const getTypeOfPropertySeizedV2 = person => {
  const types = person.nonForceActionsTaken?.typeOfPropertySeized || []

  return types.map(item => {
    const [filteredType] = SEIZED_PROPERTY_TYPES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      type: filteredType?.name || '',
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
      contraband: filteredType?.name || '',
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

const getResultOfStopV2 = (person, statutes) => {
  const types = []
  const resultsOfStop3 = person.stopResult?.resultsOfStop3 || false
  const resultsOfStop4 = person.stopResult?.resultsOfStop4 || false
  const resultsOfStop5 = person.stopResult?.resultsOfStop5 || false
  const resultsOfStop6 = person.stopResult?.resultsOfStop6 || false
  const resultsOfStop7 = person.stopResult?.resultsOfStop7 || false
  const resultsOfStop8 = person.stopResult?.resultsOfStop8 || false
  const resultsOfStop9 = person.stopResult?.resultsOfStop9 || false
  const resultsOfStop10 = person.stopResult?.resultsOfStop10 || false
  const resultsOfStop11 = person.stopResult?.resultsOfStop11 || false
  const resultsOfStop12 = person.stopResult?.resultsOfStop12 || false
  const resultsOfStop13 = person.stopResult?.resultsOfStop13 || false
  const resultsOfStop14 = person.stopResult?.resultsOfStop14 || false
  const resultsOfStop15 = person.stopResult?.resultsOfStop15 || false

  if (resultsOfStop3) {
    types.push(3)
  }
  if (resultsOfStop4) {
    types.push(4)
  }
  if (resultsOfStop5) {
    types.push(5)
  }
  if (resultsOfStop6) {
    types.push(6)
  }
  if (resultsOfStop7) {
    types.push(7)
  }
  if (resultsOfStop8) {
    types.push(8)
  }
  if (resultsOfStop9) {
    types.push(9)
  }
  if (resultsOfStop10) {
    types.push(10)
  }
  if (resultsOfStop11) {
    types.push(11)
  }
  if (resultsOfStop12) {
    types.push(12)
  }
  if (resultsOfStop13) {
    types.push(13)
  }
  if (resultsOfStop14) {
    types.push(14)
  }

  if (resultsOfStop15) {
    types.push(15)
  }

  const mappedItems = types.map(item => {
    const [filteredStopResult] = STOP_RESULTS_V2.filter(
      item2 => item2.value === item,
    )

    const stopResult = {
      key: item.toString(),
      result: filteredStopResult?.name || '',
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
    if (item === 14) {
      stopResult.listCodes = getVerbalWarningCodes(person, statutes)
    }
    if (item === 15) {
      stopResult.listCodes = getWrittenWarningCodes(person, statutes)
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

const getContrabandOrEvidenceDiscoveredV2 = person => {
  const contrabands =
    person.nonForceActionsTaken?.contrabandOrEvidenceDiscovered || []

  const mappedItems = contrabands.map(item => {
    const [filteredType] = CONTRABAND_TYPES.filter(
      item2 => item2.value === item,
    )

    return {
      key: item.toString(),
      contraband: filteredType?.name || '',
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
  const resultsOfStop2 = person.stopResult?.resultsOfStop2 || false
  const resultsOfStop3 = person.stopResult?.resultsOfStop3 || false
  const resultsOfStop4 = person.stopResult?.resultsOfStop4 || false
  const resultsOfStop5 = person.stopResult?.resultsOfStop5 || false
  const resultsOfStop6 = person.stopResult?.resultsOfStop6 || false
  const resultsOfStop7 = person.stopResult?.resultsOfStop7 || false
  const resultsOfStop8 = person.stopResult?.resultsOfStop8 || false
  const resultsOfStop9 = person.stopResult?.resultsOfStop9 || false
  const resultsOfStop10 = person.stopResult?.resultsOfStop10 || false
  const resultsOfStop11 = person.stopResult?.resultsOfStop11 || false
  const resultsOfStop12 = person.stopResult?.resultsOfStop12 || false
  const resultsOfStop13 = person.stopResult?.resultsOfStop13 || false

  if (resultsOfStop2) {
    types.push(2)
  }
  if (resultsOfStop3) {
    types.push(3)
  }
  if (resultsOfStop4) {
    types.push(4)
  }
  if (resultsOfStop5) {
    types.push(5)
  }
  if (resultsOfStop6) {
    types.push(6)
  }
  if (resultsOfStop7) {
    types.push(7)
  }
  if (resultsOfStop8) {
    types.push(8)
  }
  if (resultsOfStop9) {
    types.push(9)
  }
  if (resultsOfStop10) {
    types.push(10)
  }
  if (resultsOfStop11) {
    types.push(11)
  }
  if (resultsOfStop12) {
    types.push(12)
  }
  if (resultsOfStop13) {
    types.push(13)
  }

  const mappedItems = types.map(item => {
    const [filteredStopResult] = STOP_RESULTS.filter(
      item2 => item2.value === item,
    )

    const stopResult = {
      key: item.toString(),
      result: filteredStopResult?.name || '',
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

const getVerbalWarningCodes = (person, statutes) => {
  const codes = person.stopResult?.verbalWarningCodes || []

  return codes.map(code => {
    return getStatute(code, statutes)
  })
}

const getWrittenWarningCodes = (person, statutes) => {
  const codes = person.stopResult?.writtenWarningCodes || []

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

export const pad = (num, size) => {
  num = num.toString()
  while (num.length < size) {
    num = '0' + num
  }
  return num
}
