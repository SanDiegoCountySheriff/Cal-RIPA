export const PII_TEST_CASES = [
  { source: 'location', expectedCalls: [1, 0, 0] },
  { source: 'reason', expectedCalls: [0, 1, 0] },
  { source: 'search', expectedCalls: [0, 0, 1] },
  { source: '', expectedCalls: [0, 0, 0] },
]

export const LOCATION_PII_TEST_CASES = [
  {
    testNumber: 1,
    testValue: 'text',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    locationPiiFound: false,
    stopPiiFound: false,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 2,
    testValue: '',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 0,
    setPiiServiceAvailableCalledTimes: 0,
    locationPiiFound: undefined,
    stopPiiFound: undefined,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 3,
    testValue: 'John Smith',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    locationPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
    ],
  },
  {
    testNumber: 4,
    testValue: 'test',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    locationPiiFound: false,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Stop Reason Person: 1',
      },
    ],
  },
  {
    testNumber: 5,
    testValue: 'John Smith',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    locationPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Stop Reason Person: 1',
      },
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
    ],
  },
  {
    testNumber: 6,
    testValue: 'test',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 1,
    locationPiiFound: null,
    stopPiiFound: null,
    checkTextForPiiReturnValue: null,
    expectedPiiEntities: undefined,
  },
]

export const REASON_PII_TEST_CASES = [
  {
    testNumber: 1,
    testValue: 'text',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    reasonForStopPiiFound: false,
    stopPiiFound: false,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 2,
    testValue: '',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 0,
    setPiiServiceAvailableCalledTimes: 0,
    reasonForStopPiiFound: undefined,
    stopPiiFound: undefined,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 3,
    testValue: 'John Smith',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    reasonForStopPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Stop Reason Person: 1',
      },
    ],
  },
  {
    testNumber: 4,
    testValue: 'test',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    reasonForStopPiiFound: false,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
    ],
  },
  {
    testNumber: 5,
    testValue: 'John Smith',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    reasonForStopPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Stop Reason Person: 1',
      },
    ],
  },
  {
    testNumber: 6,
    testValue: 'test',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 1,
    reasonForStopPiiFound: null,
    stopPiiFound: null,
    checkTextForPiiReturnValue: null,
    expectedPiiEntities: undefined,
  },
]

export const BASIS_FOR_SEARCH_PII_TEST_CASES = [
  {
    testNumber: 1,
    testValue: 'text',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    expectedBasisForSearchPiiFound: false,
    stopPiiFound: false,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 2,
    testValue: '',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 0,
    setPiiServiceAvailableCalledTimes: 0,
    expectedBasisForSearchPiiFound: undefined,
    stopPiiFound: undefined,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: undefined,
  },
  {
    testNumber: 3,
    testValue: 'John Smith',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    expectedBasisForSearchPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Basis for Search Person: 1',
      },
    ],
  },
  {
    testNumber: 4,
    testValue: 'test',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    expectedBasisForSearchPiiFound: false,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: '',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
    ],
  },
  {
    testNumber: 5,
    testValue: 'John Smith',
    setStopPiiEntities: true,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 0,
    expectedBasisForSearchPiiFound: true,
    stopPiiFound: true,
    checkTextForPiiReturnValue: {
      redactedText: 'John Smith',
      minimumConfidenceScore: 0.0,
      allowedCategories: [],
      piiEntities: [
        {
          entityText: 'John Smith',
          confidenceScore: '50',
          category: 'Name',
        },
      ],
    },
    expectedPiiEntities: [
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Location',
      },
      {
        entityText: 'John Smith',
        confidenceScore: '50',
        category: 'Name',
        source: 'Basis for Search Person: 1',
      },
    ],
  },
  {
    testNumber: 6,
    testValue: 'test',
    setStopPiiEntities: false,
    checkTextForPiiCalledTimes: 1,
    setPiiServiceAvailableCalledTimes: 1,
    expectedBasisForSearchPiiFound: null,
    stopPiiFound: null,
    checkTextForPiiReturnValue: null,
    expectedPiiEntities: undefined,
  },
]

export const API_STOP = {
  id: '111111111111',
  ori: 'CA0370000',
  agency: 'SDSD',
  officerId: '111111111',
  officerName: 'Name',
  expYears: '1',
  officerAssignment: {
    key: '10',
    type: 'Other',
    otherType: 'Data Services',
  },
  date: '2022-01-01',
  time: '13:00',
  stopDateTime: '2022-01-01T12:00:00',
  stopType: null,
  location: {
    toggleLocationOptions: false,
    intersection: '',
    blockNumber: '100',
    landMark: '',
    streetName: 'Anystreet',
    highwayExit: '',
    city: {
      codes: {
        code: 'SAN DIEGO',
        text: 'SAN DIEGO',
      },
    },
    beat: {
      codes: {
        code: '009',
        text: '009 SAN DIEGO (NON-CONTRACT CITIES)',
      },
    },
    school: false,
    schoolName: null,
    outOfCounty: false,
    piiFound: false,
    geoLocation: {
      latitude: null,
      longitude: null,
    },
  },
  stopDuration: 1,
  stopInResponseToCFS: false,
  listPersonStopped: [
    {
      id: '1',
      isStudent: false,
      listPerceivedRace: [
        {
          race: 'Asian',
          key: 1,
        },
      ],
      perceivedLimitedEnglish: false,
      perceivedUnhoused: null,
      listPerceivedOrKnownDisability: [
        {
          disability: 'None',
          key: '8',
        },
      ],
      perceivedAge: 10,
      perceivedGender: 'Male',
      genderNonconforming: false,
      perceivedLgbt: false,
      reasonForStop: {
        key: '5',
        reason: 'Investigation to determine whether the person was truant',
        listDetail: [],
        listCodes: [],
      },
      reasonForStopExplanation: 'Explanation',
      reasonForStopPiiFound: false,
      listActionTakenDuringStop: [
        {
          action: 'None',
          key: '24',
        },
      ],
      listNonForceActionTakenDuringStop: null,
      listForceActionTakenDuringStop: null,
      personSearchConsentGiven: false,
      propertySearchConsentGiven: false,
      listContrabandOrEvidenceDiscovered: [
        {
          contraband: 'None',
          key: '1',
        },
      ],
      listBasisForSearch: [],
      basisForSearchBrief: null,
      basisForSearchPiiFound: false,
      listBasisForPropertySeizure: [],
      listTypeOfPropertySeized: [],
      listResultOfStop: [
        {
          result: 'None',
          listCodes: null,
          key: '1',
        },
      ],
    },
  ],
  listSubmission: null,
  status: 'Unsubmitted',
  isPiiFound: false,
  piiEntities: null,
  overridePii: false,
  editStopExplanation: null,
  editStopOfficerId: '100000002',
  isEdited: false,
  telemetry: {
    template: null,
    formCached: false,
    offline: false,
    listStepTrace: [
      {
        index: 1,
        startTimeStamp: '2022-02-11T21:32:24.216Z',
        endTimeStamp: '2022-02-11T21:32:38.912Z',
      },
      {
        index: 2,
        startTimeStamp: '2022-02-11T21:32:38.912Z',
        endTimeStamp: '2022-02-11T21:32:46.303Z',
      },
      {
        index: 3,
        startTimeStamp: '2022-02-11T21:32:46.303Z',
        endTimeStamp: '2022-02-11T21:32:57.359Z',
      },
      {
        index: 4,
        startTimeStamp: '2022-02-11T21:32:57.359Z',
        endTimeStamp: '2022-02-11T21:32:58.96Z',
      },
      {
        index: 5,
        startTimeStamp: '2022-02-11T21:32:58.96Z',
        endTimeStamp: '2022-02-11T21:33:01.343Z',
      },
    ],
    lookupCacheDate: '2022-02-11 11:13',
    pullFromReasonCode: false,
  },
  listAgencyQuestion: [],
}

export const V2_API_STOP = {
  id: '111111111111',
  ori: 'CA0370000',
  agency: 'SDSD',
  officerId: '111111111',
  officerName: 'Name',
  officerRace: 'White',
  officerGender: 'Cisgender man/boy',
  expYears: '1',
  officerAssignment: {
    key: '10',
    type: 'Other',
    otherType: 'Data Services',
  },
  date: '2022-01-01',
  time: '13:00',
  stopDateTime: '2022-01-01T12:00:00',
  stopType: 'Vehicular',
  location: {
    toggleLocationOptions: false,
    intersection: '',
    blockNumber: '100',
    landMark: '',
    streetName: 'Anystreet',
    highwayExit: '',
    city: {
      codes: {
        code: 'SAN DIEGO',
        text: 'SAN DIEGO',
      },
    },
    beat: {
      codes: {
        code: '009',
        text: '009 SAN DIEGO (NON-CONTRACT CITIES)',
      },
    },
    school: false,
    schoolName: null,
    outOfCounty: false,
    piiFound: false,
    geoLocation: {
      latitude: null,
      longitude: null,
    },
  },
  stopDuration: 1,
  stopInResponseToCFS: false,
  listPersonStopped: [
    {
      id: '1',
      isStudent: false,
      listPerceivedRace: [
        {
          race: 'Asian',
          key: 1,
        },
      ],
      perceivedLimitedEnglish: false,
      perceivedUnhoused: false,
      listPerceivedOrKnownDisability: [
        {
          disability: 'None',
          key: '8',
        },
      ],
      perceivedAge: 10,
      perceivedGender: 'Male',
      genderNonconforming: null,
      perceivedLgbt: false,
      reasonForStop: {
        key: '5',
        reason: 'Investigation to determine whether the person was truant',
        listDetail: [],
        listCodes: [],
      },
      reasonForStopExplanation: 'Explanation',
      reasonForStopPiiFound: false,
      listNonForceActionTakenDuringStop: [
        {
          action: 'None',
          key: '18',
        },
      ],
      listForceActionTakenDuringStop: [
        {
          action: 'None',
          key: '18',
        },
      ],
      listActionTakenDuringStop: null,
      personSearchConsentGiven: false,
      propertySearchConsentGiven: false,
      listContrabandOrEvidenceDiscovered: [
        {
          contraband: 'None',
          key: '1',
        },
      ],
      listBasisForSearch: [],
      basisForSearchBrief: null,
      basisForSearchPiiFound: false,
      listBasisForPropertySeizure: [],
      listTypeOfPropertySeized: [],
      listResultOfStop: [
        {
          result: 'None',
          listCodes: null,
          key: '1',
        },
      ],
    },
  ],
  listSubmission: null,
  status: 'Unsubmitted',
  isPiiFound: false,
  piiEntities: null,
  overridePii: false,
  editStopExplanation: null,
  editStopOfficerId: '100000002',
  isEdited: false,
  telemetry: {
    template: null,
    formCached: false,
    offline: false,
    listStepTrace: [
      {
        index: 1,
        startTimeStamp: '2022-02-11T21:32:24.216Z',
        endTimeStamp: '2022-02-11T21:32:38.912Z',
      },
      {
        index: 2,
        startTimeStamp: '2022-02-11T21:32:38.912Z',
        endTimeStamp: '2022-02-11T21:32:46.303Z',
      },
      {
        index: 3,
        startTimeStamp: '2022-02-11T21:32:46.303Z',
        endTimeStamp: '2022-02-11T21:32:57.359Z',
      },
      {
        index: 4,
        startTimeStamp: '2022-02-11T21:32:57.359Z',
        endTimeStamp: '2022-02-11T21:32:58.96Z',
      },
      {
        index: 5,
        startTimeStamp: '2022-02-11T21:32:58.96Z',
        endTimeStamp: '2022-02-11T21:33:01.343Z',
      },
    ],
    lookupCacheDate: '2022-02-11 11:13',
    pullFromReasonCode: false,
  },
  listAgencyQuestion: [],
}

export const FULL_STOP = {
  agencyQuestions: [],
  id: 0,
  internalId: 'Internal ID 1',
  isPiiFound: false,
  location: {
    beat: '1',
    blockNumber: '100',
    city: 'City',
    highwayExit: null,
    intersection: null,
    isSchool: false,
    landmark: null,
    latituted: 100,
    longitude: 100,
    outOfCounty: false,
    piiFound: false,
    school: null,
    streetName: 'Street Name',
    toggleLocationOptions: false,
  },
  people: [
    {
      actionsTaken: {
        actionsTakenDuringStop: [],
        nonForceActionsTakenDuringStop: null,
        forceActionsTakenDuringStop: null,
        anyActionsTaken: false,
        anyContraband: false,
        basisForPropertySeizure: [],
        basisForSearch: [],
        basisForSearchExplanation: null,
        basisForSearchPiiFound: false,
        contrabandOrEvidenceDiscovered: [],
        personSearchConsentGiven: false,
        propertySearchConsentGiven: false,
        propertyWasSeized: false,
        typeOfPropertySeized: [],
      },
      anyDisabilities: false,
      genderNonconforming: false,
      id: 1,
      index: 1,
      isStudent: false,
      perceivedAge: 20,
      perceivedGender: 1,
      perceivedLgbt: false,
      perceivedLImitedEnglish: false,
      perceivedOrKnownDisability: [],
      perceivedRace: [1],
      stopReason: {
        educationViolation: null,
        educationViolationCode: [],
        reasonForStop: 1,
        reasonForStopExplanation: 'explanation',
        reasonForStopPiiFound: false,
        reasonableSuspicion: null,
        reasonableSuspicionCode: null,
        searchOfPerson: false,
        searchOfProperty: false,
        trafficViolation: 1,
        trafficViolationCode: 1,
      },
      stopResult: {
        anyResultsOfStop: false,
        citationCodes: null,
        custodialArrestCodes: null,
        infieldCodes: null,
        pullFromReasonCode: false,
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
        warningCodes: null,
      },
    },
  ],
  stepTrace: [
    {
      index: 1,
      startTimeStamp: '2022-01-01T12:00:00.000Z',
      endTimeStamp: '2022-01-01T12:01:00.000Z',
    },
    {
      index: 2,
      startTimeStamp: '2022-01-01T12:01:00.000Z',
      endTimeStamp: '2022-01-01T12:02:00.000Z',
    },
    {
      index: 3,
      startTimeStamp: '2022-01-01T12:02:00.000Z',
      endTimeStamp: '2022-01-01T12:03:00.000Z',
    },
    {
      index: 4,
      startTimeStamp: '2022-01-01T12:03:00.000Z',
      endTimeStamp: '2022-01-01T12:04:00.000Z',
    },
    {
      index: 5,
      startTimeStamp: '2022-01-01T12:04:00.000Z',
      endTimeStamp: '2022-01-01T12:05:00.000Z',
    },
  ],
  stopDate: {
    date: '2022-01-01',
    duration: 10,
    stopInResponseToCFS: false,
    time: '12:00',
  },
  template: null,
}

export const V2_FULL_STOP = {
  agencyQuestions: [],
  id: 0,
  internalId: 'Internal ID 1',
  isPiiFound: false,
  location: {
    beat: '1',
    blockNumber: '100',
    city: 'City',
    highwayExit: null,
    intersection: null,
    isSchool: false,
    landmark: null,
    latituted: 100,
    longitude: 100,
    outOfCounty: false,
    piiFound: false,
    school: null,
    streetName: 'Street Name',
    toggleLocationOptions: false,
  },
  people: [
    {
      actionsTaken: {
        nonForceActionsTakenDuringStop: [],
        forceActionsTakenDuringStop: [],
        actionsTakenDuringStop: null,
        anyActionsTaken: false,
        anyContraband: false,
        basisForPropertySeizure: [],
        basisForSearch: [],
        basisForSearchExplanation: null,
        basisForSearchPiiFound: false,
        contrabandOrEvidenceDiscovered: [],
        personSearchConsentGiven: false,
        propertySearchConsentGiven: false,
        propertyWasSeized: false,
        typeOfPropertySeized: [],
      },
      anyDisabilities: false,
      id: 1,
      index: 1,
      isStudent: false,
      perceivedAge: 20,
      perceivedGender: 1,
      genderNonconforming: null,
      perceivedLgbt: false,
      perceivedLImitedEnglish: false,
      perceivedOrKnownDisability: [],
      perceivedRace: [1],
      stopReason: {
        educationViolation: null,
        educationViolationCode: [],
        reasonForStop: 1,
        reasonForStopExplanation: 'explanation',
        reasonForStopPiiFound: false,
        reasonableSuspicion: null,
        reasonableSuspicionCode: null,
        searchOfPerson: false,
        searchOfProperty: false,
        trafficViolation: 1,
        trafficViolationCode: 1,
      },
      stopResult: {
        anyResultsOfStop: false,
        citationCodes: null,
        custodialArrestCodes: null,
        infieldCodes: null,
        pullFromReasonCode: false,
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
        warningCodes: null,
      },
    },
  ],
  stepTrace: [
    {
      index: 1,
      startTimeStamp: '2022-01-01T12:00:00.000Z',
      endTimeStamp: '2022-01-01T12:01:00.000Z',
    },
    {
      index: 2,
      startTimeStamp: '2022-01-01T12:01:00.000Z',
      endTimeStamp: '2022-01-01T12:02:00.000Z',
    },
    {
      index: 3,
      startTimeStamp: '2022-01-01T12:02:00.000Z',
      endTimeStamp: '2022-01-01T12:03:00.000Z',
    },
    {
      index: 4,
      startTimeStamp: '2022-01-01T12:03:00.000Z',
      endTimeStamp: '2022-01-01T12:04:00.000Z',
    },
    {
      index: 5,
      startTimeStamp: '2022-01-01T12:04:00.000Z',
      endTimeStamp: '2022-01-01T12:05:00.000Z',
    },
  ],
  stopDate: {
    date: '2022-01-01',
    duration: 10,
    stopInResponseToCFS: false,
    time: '12:00',
  },
  stopType: 'Vehicular',
  template: null,
}

export const STOP = {
  id: 1,
  internalId: 1,
  template: null,
  editStopExplanation: null,
  isPiiFound: false,
  overridePii: false,
  stepTrace: [
    {
      index: 1,
      startTimeStamp: '2022-01-01T12:00:00.000Z',
      endTimeStamp: '2022-01-01T12:01:00.000Z',
    },
    {
      index: 2,
      startTimeStamp: '2022-01-01T12:01:00.000Z',
      endTimeStamp: '2022-01-01T12:02:00.000Z',
    },
    {
      index: 3,
      startTimeStamp: '2022-01-01T12:02:00.000Z',
      endTimeStamp: '2022-01-01T12:03:00.000Z',
    },
    {
      index: 4,
      startTimeStamp: '2022-01-01T12:03:00.000Z',
      endTimeStamp: '2022-01-01T12:04:00.000Z',
    },
    {
      index: 5,
      startTimeStamp: '2022-01-01T12:04:00.000Z',
      endTimeStamp: '2022-01-01T12:05:00.000Z',
    },
  ],
  actionsTaken: {
    anyActionsTaken: false,
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
  location: {
    isSchool: false,
    school: null,
    blockNumber: '100',
    streetName: 'Street Name',
    intersection: null,
    toggleLocationOptions: false,
    highwayExit: null,
    landmark: null,
    piiFound: false,
    outOfCounty: false,
    city: 'City',
    beat: '1',
    latitude: 10,
    longitude: 10,
  },
  person: {
    anyDisabilities: false,
    genderNonconforming: false,
    id: 1,
    isStudent: false,
    perceivedAge: 33,
    perceivedGender: 1,
    perceivedLgbt: false,
    perceivedLimitedEnglish: false,
    perceivedOrKnownDisability: [],
    perceivedRace: [1],
  },
  stopDate: {
    date: '2022-01-01',
    time: '12:00',
    duration: 10,
    stopInResponseToCFS: false,
  },
  stopReason: {
    reasonForStop: 1,
    educationViolation: null,
    educationViolationCode: [],
    trafficViolation: 1,
    trafficViolationCode: 1,
    reasonableSuspicion: null,
    reasonableSuspicionCode: null,
    reasonForStopExplanation: 'explanation',
    reasonForStopPiiFound: false,
    searchOfPerson: false,
    searchOfProperty: false,
  },
  stopResult: {
    anyResultsOfStop: false,
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
    warningCodes: null,
    citationCodes: null,
    infieldCodes: null,
    custodialArrestCodes: null,
    pullFromReasonCode: false,
  },
  agencyQuestions: [],
}

export const V2_STOP = {
  id: 1,
  internalId: 1,
  template: null,
  editStopExplanation: null,
  isPiiFound: false,
  overridePii: false,
  stopType: 'Vehicular',
  stepTrace: [
    {
      index: 1,
      startTimeStamp: '2022-01-01T12:00:00.000Z',
      endTimeStamp: '2022-01-01T12:01:00.000Z',
    },
    {
      index: 2,
      startTimeStamp: '2022-01-01T12:01:00.000Z',
      endTimeStamp: '2022-01-01T12:02:00.000Z',
    },
    {
      index: 3,
      startTimeStamp: '2022-01-01T12:02:00.000Z',
      endTimeStamp: '2022-01-01T12:03:00.000Z',
    },
    {
      index: 4,
      startTimeStamp: '2022-01-01T12:03:00.000Z',
      endTimeStamp: '2022-01-01T12:04:00.000Z',
    },
    {
      index: 5,
      startTimeStamp: '2022-01-01T12:04:00.000Z',
      endTimeStamp: '2022-01-01T12:05:00.000Z',
    },
  ],
  actionsTaken: {
    anyActionsTaken: false,
    nonForceActionsTakenDuringStop: [],
    forceActionsTakenDuringStop: [],
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
  location: {
    isSchool: false,
    school: null,
    blockNumber: '100',
    streetName: 'Street Name',
    intersection: null,
    toggleLocationOptions: false,
    highwayExit: null,
    landmark: null,
    piiFound: false,
    outOfCounty: false,
    city: 'City',
    beat: '1',
    latitude: 10,
    longitude: 10,
  },
  person: {
    anyDisabilities: false,
    id: 1,
    isStudent: false,
    perceivedAge: 33,
    perceivedGender: 1,
    genderNonconforming: null,
    perceivedLgbt: false,
    perceivedLimitedEnglish: false,
    perceivedOrKnownDisability: [],
    perceivedRace: [1],
  },
  stopDate: {
    date: '2022-01-01',
    time: '12:00',
    duration: 10,
    stopInResponseToCFS: false,
  },
  stopReason: {
    reasonForStop: 1,
    educationViolation: null,
    educationViolationCode: [],
    trafficViolation: 1,
    trafficViolationCode: 1,
    reasonableSuspicion: null,
    reasonableSuspicionCode: null,
    reasonForStopExplanation: 'explanation',
    reasonForStopPiiFound: false,
    searchOfPerson: false,
    searchOfProperty: false,
  },
  stopResult: {
    anyResultsOfStop: false,
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
    warningCodes: null,
    citationCodes: null,
    infieldCodes: null,
    custodialArrestCodes: null,
    pullFromReasonCode: false,
  },
  agencyQuestions: [],
}

export const USER = {
  isAdmin: false,
  isAuthenticated: false,
  isInvalid: false,
  officerName: null,
  officerRace: 'race',
  officerGender: 'gender',
  oid: '',
  id: '',
  agency: 'Agency',
  assignment: 1,
  favoriteLocations: '',
  favoriteReasons: '',
  favoriteResults: '',
  officerId: '1',
  otherType: '1',
  startDate: '2020-01-01',
  yearsExperience: 1,
}

export const LEGACY_USER = {
  isAdmin: false,
  isAuthenticated: false,
  isInvalid: false,
  officerName: null,
  oid: '',
  id: '',
  agency: 'Agency',
  assignment: 1,
  favoriteLocations: '',
  favoriteReasons: '',
  favoriteResults: '',
  officerId: '1',
  otherType: '1',
  startDate: '2020-01-01',
  yearsExperience: 1,
}

export const DEFAULT_STATE = {
  isDark: true,
  isOnline: false,
  adminBeats: [],
  adminCities: [],
  adminSchools: [],
  adminStatutes: [],
  adminStops: {},
  adminSubmissions: {},
  adminSubmission: null,
  adminUsers: [],
  agencyQuestions: [],
  formBeats: [],
  formCountyCities: [],
  formNonCountyCities: [],
  formSchools: [],
  formStatutes: [],
  formStops: [],
  formTemplates: [],
  user: {
    agency: '',
    oid: '',
    isAdmin: false,
    isInvalid: null,
    isAuthenticated: false,
    officerId: null,
    officerName: null,
    assignment: null,
    otherType: null,
  },
  apiConfig: null,
  piiDate: null,
  officerStops: [],
  gpsLocationAddress: null,
  errorCodeAdminSearch: {
    items: [],
  },
  stopSubmissionStatusTotal: 0,
  stopSubmissionStatusError: 0,
  stopSubmissionPassedIds: [],
  stopSubmissionFailedStops: [],
  stopsWithErrors: [],
  cpraReportStats: {},
  historicalCpraReports: [],
  piiServiceAvailable: true,
  personSearchAutomaticallySelected: false,
  propertySearchAutomaticallySelected: false,
  stopQueryData: null,
  resetPagination: true,
}
