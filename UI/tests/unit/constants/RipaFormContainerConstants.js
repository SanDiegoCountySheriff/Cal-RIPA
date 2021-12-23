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
        source: 'Basis for Search Person: ',
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
        source: 'Basis for Search Person: ',
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

export const REASON_PII_TEST_CASES = []
