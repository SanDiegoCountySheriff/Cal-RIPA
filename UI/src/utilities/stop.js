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

const defaultLocation = () => {
  const lastLocation = getLastLocation()
  if (lastLocation) {
    return lastLocation
  }
  return {
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
  }
}

export const defaultStop = () => {
  return {
    actionsTaken: {},
    id: uniqueId(),
    template: null,
    stepTrace: [],
    location: defaultLocation(),
    person: {
      id: new Date().getTime(),
      index: 1,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
    },
    stopReason: {},
    stopResult: {
      anyActionsTaken: true,
      pullFromReasonCode: false,
    },
    agencyQuestions: mappedAgencyQuestions(),
  }
}

export const motorStop = () => {
  return {
    actionsTaken: {},
    id: uniqueId(),
    template: 'motor',
    stepTrace: [],
    location: defaultLocation(),
    person: {
      id: new Date().getTime(),
      index: 1,
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
      actionsTakenDuringStop2: false,
      actionsTakenDuringStop3: true,
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
      pullFromReasonCode: true,
    },
    agencyQuestions: mappedAgencyQuestions(),
  }
}

export const probationStop = () => {
  return {
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
    id: uniqueId(),
    template: 'probation',
    stepTrace: [],
    location: defaultLocation(),
    person: {
      id: new Date().getTime(),
      index: 1,
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
      pullFromReasonCode: false,
    },
    agencyQuestions: mappedAgencyQuestions(),
  }
}

export const apiStopStopSummary = apiStop => {
  const items = []
  items.push({ id: 'A1', content: getSummaryPersonCount(apiStop) })
  items.push({ id: 'A2', content: getSummaryDate(apiStop) })
  items.push({ id: 'A3', content: getSummaryTime(apiStop) })
  items.push({ id: 'A4', content: getSummaryLocation(apiStop) })
  items.push({ id: 'A5', content: getSummaryOfficer(apiStop) })
  items.push({ id: 'A6', content: getSummaryDuration(apiStop) })
  items.push({ id: 'A7', content: getSummaryStopInResponseToCfs(apiStop) })
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
  const children = []

  if (apiStop.school && apiStop.location.schoolName) {
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
    detail: apiStop.stopInResponseToCfs || false,
  }
}

export const apiStopPersonSummary = (apiStop, personId) => {
  const [person] = apiStop.listPersonStopped.filter(
    item => item.id === personId,
  )
  if (person) {
    const items = []
    items.push({ id: 'B1', content: getSummaryStudent(person) })
    items.push({ id: 'B2', content: getSummaryPerceivedRace(person) })
    items.push({ id: 'B3', content: getSummaryGenderNonconforming(person) })
    items.push({ id: 'B4', content: getSummaryPerceivedGender(person) })
    items.push({ id: 'B5', content: getSummaryPerceivedLgbt(person) })
    items.push({ id: 'B6', content: getSummaryPerceivedAge(person) })
    items.push({ id: 'B7', content: getSummaryLimitedEnglish(person) })
    items.push({
      id: 'B8',
      content: getSummaryPerceivedOrKnownDisability(person),
    })
    items.push({ id: 'B9', content: getSummaryReasonForStop(person) })
    items.push({
      id: 'B10',
      content: getSummaryReasonForStopExplanation(person),
    })
    items.push({ id: 'B11', content: getSummaryActionsTaken(person) })
    items.push({ id: 'B12', content: getSummaryBasisForSearch(person) })
    items.push({
      id: 'B13',
      content: getSummaryBasisForSearchExplanation(person),
    })
    items.push({
      id: 'B14',
      content: getSummaryBasisForPropertySeizure(person),
    })
    items.push({ id: 'B15', content: getSummaryTypeOfPropertySeized(person) })
    items.push({ id: 'B16', content: getSummaryContraband(person) })
    items.push({ id: 'B17', content: getSummaryResultOfStop(person) })
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

const getSummaryReasonForStop = person => {
  const reasons = []
  reasons.push({
    detail: person.reasonForStop.reason,
  })

  const keys = person.reasonForStop.listDetail.map(item => {
    return {
      marginLeft: true,
      detail: item.reason,
    }
  })
  reasons.push(...keys)

  const codes = person.reasonForStop.listCodes.map(item => {
    return {
      marginLeft: true,
      detail: item.text,
    }
  })
  reasons.push(...codes)

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

const getSummaryActionsTaken = person => {
  const actions = person.listActionTakenDuringStop
    .map(item => item.action)
    .map(item => {
      return {
        detail: item,
      }
    })
  if (
    person.listBasisForPropertySeizure &&
    person.listTypeOfPropertySeized &&
    (person.listBasisForPropertySeizure.length > 0 ||
      person.listTypeOfPropertySeized.length > 0)
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

const getSummaryResultOfStop = person => {
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
        content: getSummaryAgencyQuestion(item.label, item.answer),
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
    items.push({ id: 'D1', content: getSummaryTelemetryTemplate(apiStop) })
    items.push({
      id: 'D2',
      content: getSummaryTelemetryLookupCacheDate(apiStop),
    })
    items.push({
      id: 'D3',
      content: getSummaryTelemetryPullFromReasonCode(apiStop),
    })
    items.push({ id: 'D4', content: getSummaryTelemetryFormCached(apiStop) })
    items.push({ id: 'D5', content: getSummaryTelemetryStepTrace(apiStop) })
  }

  return items
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

export const apiStopToFullStop = apiStop => {
  const blockNumber = apiStop.location?.blockNumber || null
  const schoolNumber = apiStop.location?.schoolName?.codes?.code || null
  const cityName = apiStop.location?.city?.codes?.code || null
  const beatNumber = apiStop.location?.beat?.codes?.code || null

  return {
    id: apiStop.id,
    template: apiStop.telemetry?.template || null,
    stepTrace: apiStop.telemetry?.listStepTrace || [],
    stopDate: {
      date: apiStop.date,
      time: apiStop.time,
      duration: Number(apiStop.stopDuration),
      stopInResponseToCfs: apiStop.stopInResponseToCfs,
    },
    location: {
      isSchool: apiStop.location?.school || false,
      school: schoolNumber ? Number(schoolNumber) : null,
      blockNumber: blockNumber ? Number(blockNumber) : null,
      streetName: apiStop.location?.streetName || null,
      intersection: apiStop.location?.intersection || null,
      moreLocationOptions: apiStop.location?.toggleLocationOptions || false,
      highwayExit: apiStop.location?.highwayExit || null,
      landmark: apiStop.location?.landMark || null,
      piiFound: apiStop.location?.piiFound || false,
      outOfCounty: apiStop.location?.outOfCounty || false,
      city: cityName || null,
      beat: beatNumber ? Number(beatNumber) : null,
    },
    agencyQuestions: apiStop.listAgencyQuestion || [],
    people: getFullStopPeopleListed(apiStop),
  }
}

const getFullStopPeopleListed = apiStop => {
  const telemetry = apiStop.telemetry || null
  const people = apiStop.listPersonStopped
  return people.map((person, index) => {
    return {
      id: person.id,
      index: index + 1,
      isStudent: person.isStudent || false,
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
        pullFromReasonCode: telemetry?.pullFromReasonCode || false,
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
          person.listTypeOfPropertySeized.length > 0,
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

export const fullStopToStop = fullStop => {
  const person = fullStop.people.length > 0 ? fullStop.people[0] : null
  return {
    id: fullStop.id,
    template: fullStop.template,
    stepTrace: fullStop.stepTrace,
    stopDate: fullStop.stopDate,
    location: fullStop.location,
    agencyQuestions: fullStop.agencyQuestions,
    ...person,
  }
}

export const getOfficerFromLocalStorage = () => {
  const officer = localStorage.getItem('ripa_officer')
  return officer ? JSON.parse(officer) : null
}

export const fullStopToApiStop = (
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

  return {
    agency: officer.agency,
    date: fullStop.stopDate.date,
    expYears: officer.yearsExperience?.toString() || '',
    id: fullStop.id,
    telemetry: {
      template: fullStop.template || null,
      formCached: formCached === '1',
      listStepTrace: fullStop.stepTrace,
      lookupCacheDate: lookupCacheDate
        ? format(new Date(lookupCacheDate), 'yyyy-MM-dd kk:mm')
        : null,
      pullFromReasonCode:
        fullStop.people.filter(item => item.pullFromReasonCode).length > 0,
    },
    listAgencyQuestion: fullStop.agencyQuestions || [],
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
      otherType: officer?.otherType || '',
      type: assignment.text,
    },
    officerId: officer.officerId,
    officerName: officer.officerName,
    stopDateTime: new Date(
      formatDateTime(fullStop.stopDate.date, fullStop.stopDate.time),
    ),
    stopDuration: duration ? duration.toString() : null,
    stopInResponseToCfs: fullStop.stopDate?.stopInResponseToCfs || false,
    time: fullStop.stopDate.time,
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

const getOfficerAssignment = assignment => {
  const [filteredAssignment] = OFFICER_ASSIGNMENTS.filter(
    item => item.value === assignment,
  )

  return {
    code: assignment.toString(),
    text: filteredAssignment ? filteredAssignment.name : 'N/A',
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
    return getReasonableSuspicion(person)
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
  const suspicion = person.stopReason?.reasonableSuspicion || []
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
