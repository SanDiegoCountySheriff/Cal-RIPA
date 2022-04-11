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