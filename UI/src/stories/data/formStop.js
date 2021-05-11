export const sampleStop = {
  id: new Date().getTime(),
  officer: { editOfficer: false, yearsExperience: 25, assignment: 1 },
  stopDate: {
    date: '2021-05-07',
    time: '10:18',
    duration: 30,
    stopInResponseToCfs: false,
  },
  location: {
    isSchool: false,
    school: null,
    blockNumber: 1100,
    streetName: 'Fang',
    intersection: null,
    moreLocationOptions: false,
    highwayExit: null,
    landmark: null,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  person: {
    id: new Date.getTime(),
    isStudent: false,
    perceivedRace: [7],
    perceivedGender: 3,
    perceivedLgbt: true,
    perceivedAge: 30,
    perceivedLimitedEnglish: true,
    anyDisabilities: true,
    perceivedOrKnownDisability: [4, 2],
  },
  stopReason: {
    reasonForStop: 1,
    trafficViolation: 1,
    trafficViolationCode: 54106,
    reasonForStopExplanation: 'Speeding at 2222 Ghost Road',
    reasonForStopPiiFound: true,
  },
  stopResult: {
    anyActionsTaken: true,
    actionsTakenDuringStop1: true,
    actionsTakenDuringStop2: true,
    actionsTakenDuringStop3: false,
    actionsTakenDuringStop4: false,
    actionsTakenDuringStop5: false,
    actionsTakenDuringStop6: false,
    actionsTakenDuringStop7: false,
    actionsTakenDuringStop8: false,
    actionsTakenDuringStop9: false,
    actionsTakenDuringStop10: false,
    warningCodes: [54134],
    citationCodes: [35152],
    infieldCodes: null,
    custodialArrestCodes: null,
  },
  actionsTaken: {
    anyActionsTaken: true,
    actionsTakenDuringStop: [1, 4, 5, 17, 18, 19, 20],
    personSearchConsentGiven: true,
    propertySearchConsentGiven: true,
    basisForSearch: [7],
    basisForSearchExplanation: 'John Doe smelled like pot',
    basisForSearchPiiFound: true,
    propertyWasSeized: true,
    basisForPropertySeizure: [2],
    typeOfPropertySeized: [7, 4],
  },
}

export const onePersonFullStop = {
  id: new Date.getTime(),
  created: '2021-05-07T14:30:29.321Z',
  updated: '2021-05-07T14:32:53.959Z',
  officer: { editOfficer: false, yearsExperience: 25, assignment: 1 },
  stopDate: {
    date: '2021-05-07',
    time: '10:18',
    duration: 30,
    stopInResponseToCfs: false,
  },
  location: {
    isSchool: true,
    school: 1611766090559,
    blockNumber: 1100,
    streetName: 'Fang',
    intersection: null,
    moreLocationOptions: false,
    highwayExit: null,
    landmark: null,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  people: [
    {
      id: new Date.getTime(),
      isStudent: false,
      perceivedRace: [2, 7],
      perceivedGender: 5,
      perceivedLgbt: true,
      perceivedAge: 30,
      perceivedLimitedEnglish: true,
      anyDisabilities: true,
      perceivedOrKnownDisability: [4, 2],
      stopReason: {
        reasonForStop: 1,
        trafficViolation: 1,
        trafficViolationCode: 54106,
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      stopResult: {
        anyActionsTaken: true,
        actionsTakenDuringStop1: true,
        actionsTakenDuringStop2: true,
        actionsTakenDuringStop3: false,
        actionsTakenDuringStop4: false,
        actionsTakenDuringStop5: false,
        actionsTakenDuringStop6: false,
        actionsTakenDuringStop7: false,
        actionsTakenDuringStop8: false,
        actionsTakenDuringStop9: false,
        actionsTakenDuringStop10: false,
        warningCodes: [54134],
        citationCodes: [35152],
        infieldCodes: null,
        custodialArrestCodes: null,
      },
      actionsTaken: {
        anyActionsTaken: true,
        actionsTakenDuringStop: [1, 4, 5, 17, 18, 19, 20],
        personSearchConsentGiven: true,
        propertySearchConsentGiven: true,
        basisForSearch: [7],
        basisForSearchExplanation: 'John Doe smelled like pot',
        basisForSearchPiiFound: true,
        propertyWasSeized: true,
        basisForPropertySeizure: [2],
        typeOfPropertySeized: [7, 4],
      },
    },
  ],
}

export const twoPersonFullStop = {
  id: new Date.getTime(),
  created: '2021-05-07T14:30:29.321Z',
  updated: '2021-05-07T14:32:53.959Z',
  officer: { editOfficer: false, yearsExperience: 25, assignment: 1 },
  stopDate: {
    date: '2021-05-07',
    time: '10:18',
    duration: 30,
    stopInResponseToCfs: false,
  },
  location: {
    isSchool: true,
    school: 1611766090559,
    blockNumber: 1100,
    streetName: 'Fang',
    intersection: null,
    moreLocationOptions: false,
    highwayExit: null,
    landmark: null,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  people: [
    {
      id: new Date.getTime(),
      isStudent: false,
      perceivedRace: [2, 7],
      perceivedGender: 5,
      perceivedLgbt: true,
      perceivedAge: 30,
      perceivedLimitedEnglish: true,
      anyDisabilities: true,
      perceivedOrKnownDisability: [4, 2],
      stopReason: {
        reasonForStop: 1,
        trafficViolation: 1,
        trafficViolationCode: 54106,
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      stopResult: {
        anyActionsTaken: true,
        actionsTakenDuringStop1: true,
        actionsTakenDuringStop2: true,
        actionsTakenDuringStop3: false,
        actionsTakenDuringStop4: false,
        actionsTakenDuringStop5: false,
        actionsTakenDuringStop6: false,
        actionsTakenDuringStop7: false,
        actionsTakenDuringStop8: false,
        actionsTakenDuringStop9: false,
        actionsTakenDuringStop10: false,
        warningCodes: [54134],
        citationCodes: [35152],
        infieldCodes: null,
        custodialArrestCodes: null,
      },
      actionsTaken: {
        anyActionsTaken: true,
        actionsTakenDuringStop: [1, 4, 5, 17, 18, 19, 20],
        personSearchConsentGiven: true,
        propertySearchConsentGiven: true,
        basisForSearch: [7],
        basisForSearchExplanation: 'John Doe smelled like pot',
        basisForSearchPiiFound: true,
        propertyWasSeized: true,
        basisForPropertySeizure: [2],
        typeOfPropertySeized: [7, 4],
      },
    },
    {
      id: new Date.getTime(),
      isStudent: true,
      perceivedRace: [2],
      perceivedGender: 1,
      perceivedLgbt: false,
      perceivedAge: 40,
      anyDisabilities: true,
      perceivedOrKnownDisability: [1],
      perceivedLimitedEnglish: true,
      stopReason: {
        reasonForStop: 1,
        trafficViolation: 1,
        trafficViolationCode: 54106,
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      actionsTaken: {
        anyActionsTaken: true,
        actionsTakenDuringStop: [1, 3, 4, 5, 18, 17],
        personSearchConsentGiven: true,
        propertySearchConsentGiven: false,
        basisForSearch: [7],
        basisForSearchExplanation: 'Smelled like pot',
        propertyWasSeized: false,
        basisForPropertySeizure: [2],
        typeOfPropertySeized: [7, 4],
        basisForSearchPiiFound: false,
        anyContraband: true,
        contrabandOrEvidenceDiscovered: [4, 7],
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
        warningCodes: [],
        citationCodes: [35152, 35154],
        infieldCodes: [],
        custodialArrestCodes: [],
      },
    },
  ],
}
