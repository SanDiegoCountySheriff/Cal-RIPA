import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { formatDateTime } from '@/utilities/dates'
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

const emptyLocation = () => {
  return {
    isSchool: false,
    school: null,
    fullAddress: '',
    blockNumber: null,
    streetName: null,
    intersection: null,
    toggleLocationOptions: false,
    highwayExit: null,
    landmark: null,
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
    actionsTaken: {
      anyActionsTaken: true,
    },
    id: 0,
    internalId: nanoid(),
    template: null,
    stepTrace: [],
    location: emptyLocation(),
    person: {
      id: new Date().getTime(),
      index: 1,
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'kk:mm'),
    },
    stopReason: stopReasonGivenTemplate(),
    stopResult: stopResultGivenTemplate(),
    agencyQuestions: mappedAgencyQuestions(),
  }
}

export const motorStop = () => {
  return {
    actionsTaken: {
      anyActionsTaken: true,
    },
    stopReason: stopReasonGivenTemplate('motor'),
    stopResult: stopResultGivenTemplate('motor'),
  }
}

export const probationStop = () => {
  return {
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
    stopReason: stopReasonGivenTemplate('probation'),
    stopResult: stopResultGivenTemplate('probation'),
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

  return {}
}

export const stopResultGivenTemplate = template => {
  if (template === 'motor') {
    return {
      anyResultsOfStop: true,
      resultsOfStop2: false,
      resultsOfStop3: true,
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
      warningCodes: [],
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
    pullFromReasonCode: false,
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
  if (apiStop.location.highwayExit) {
    children.push({
      header: 'Highway Exit',
      detail: apiStop.location.highwayExit,
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
  if (apiStop.location.latitude && apiStop.location.longitude) {
    children.push({
      header: 'Latitude',
      detail: apiStop.location.latitude,
    })
    children.push({
      header: 'Longitude',
      detail: apiStop.location.longitude,
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
      { header: 'Officer Race', detail: apiStop.officerRace },
      { header: 'Officer Gender', detail: apiStop.officerGender },
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
    detail: apiStop.stopInResponseToCFS || false,
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
    if (person.perceivedUnhoused !== null) {
      items.push({ id: 'B7', content: getSummaryPerceivedUnhoused(person) })
    }
    items.push({ id: 'B8', content: getSummaryLimitedEnglish(person) })
    items.push({
      id: 'B9',
      content: getSummaryPerceivedOrKnownDisability(person),
    })
    items.push({ id: 'B10', content: getSummaryReasonForStop(person) })
    items.push({
      id: 'B11',
      content: getSummaryReasonForStopExplanation(person),
    })
    items.push({ id: 'B12', content: getSummaryActionsTaken(person) })
    items.push({ id: 'B13', content: getSummaryBasisForSearch(person) })
    items.push({
      id: 'B14',
      content: getSummaryBasisForSearchExplanation(person),
    })
    items.push({
      id: 'B15',
      content: getSummaryBasisForPropertySeizure(person),
    })
    items.push({ id: 'B16', content: getSummaryTypeOfPropertySeized(person) })
    items.push({ id: 'B17', content: getSummaryContraband(person) })
    items.push({ id: 'B18', content: getSummaryResultOfStop(person) })
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

const getSummaryPerceivedUnhoused = person => {
  return {
    level: 1,
    header: 'Perceived Unhoused',
    detail: person.perceivedUnhoused,
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
  const codes = listCodes.map(item => {
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
      perceivedUnhoused: person.perceivedUnhoused,
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
    person: {
      anyDisabilities: person.anyDisabilities || false,
      genderNonconforming: person.genderNonconforming || false,
      id: person.id,
      isStudent: person.isStudent || false,
      perceivedAge: person.perceivedAge || null,
      perceivedGender: person.perceivedGender || null,
      perceivedLgbt: person.perceivedLgbt || false,
      perceivedUnhoused: person.perceivedUnhoused || null,
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
    officerRace: parsedApiStop
      ? parsedApiStop.officerRace
      : officer.officerRace,
    officerGender: parsedApiStop
      ? parsedApiStop.officerGender
      : officer.officerGender,
    stopDateTime: new Date(
      formatDateTime(fullStop.stopDate.date, fullStop.stopDate.time),
    ),
    stopDuration: duration ? duration.toString() : null,
    stopInResponseToCFS: fullStop.stopDate?.stopInResponseToCFS || false,
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
      perceivedUnhoused:
        person.perceivedUnhoused !== null ? person.perceivedUnhoused : null,
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
      basisForSearchPiiFound =
        person.actionsTaken?.basisForSearchPiiFound || false
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

const getPerceivedGenderCode = person => {
  const gender = getPerceivedGender(person)
  return gender?.code || null
}

const getPerceivedGenderText = person => {
  const gender = getPerceivedGender(person)
  return gender?.text || ''
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
    const educationViolationCode =
      person.stopReason?.educationViolationCode || null
    if (educationViolationCode) {
      return [getEducationViolationCode(person)]
    } else {
      return []
    }
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
