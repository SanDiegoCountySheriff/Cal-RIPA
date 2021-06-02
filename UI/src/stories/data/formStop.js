import { uniqueId } from '@/utilities/dates'

export const sampleStop = {
  id: uniqueId(),
  officer: {
    yearsExperience: 25,
    assignment: 1,
    otherType: null,
  },
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
    piiFound: false,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  person: {
    id: new Date().getTime(),
    index: 1,
    isStudent: true,
    perceivedRace: [7],
    perceivedGender: 3,
    genderNonconforming: false,
    perceivedLgbt: true,
    perceivedAge: 18,
    perceivedLimitedEnglish: true,
    anyDisabilities: true,
    perceivedOrKnownDisability: [4, 2],
  },
  stopReason: {
    reasonForStop: 1,
    trafficViolation: 1,
    trafficViolationCode: 54106,
    reasonableSuspicion: null,
    reasonableSuspicionCode: null,
    educationViolation: null,
    educationViolationCode: null,
    reasonForStopExplanation: 'Speeding at 2222 Ghost Road',
    reasonForStopPiiFound: true,
  },
  stopResult: {
    anyActionsTaken: true,
    actionsTakenDuringStop2: true,
    actionsTakenDuringStop3: true,
    actionsTakenDuringStop4: false,
    actionsTakenDuringStop5: false,
    actionsTakenDuringStop6: false,
    actionsTakenDuringStop7: false,
    actionsTakenDuringStop8: false,
    actionsTakenDuringStop9: false,
    actionsTakenDuringStop10: false,
    actionsTakenDuringStop11: false,
    actionsTakenDuringStop12: true,
    actionsTakenDuringStop13: true,
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
  agency: 'sdsd',
  id: uniqueId(),
  officer: {
    yearsExperience: 25,
    assignment: 1,
    otherType: null,
  },
  officerId: '210518694',
  officerName: 'Steve Pietrek',
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
    piiFound: false,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  people: [
    {
      id: new Date().getTime() + '1',
      index: 1,
      isStudent: true,
      perceivedRace: [2, 7],
      perceivedGender: 3,
      genderNonconforming: true,
      perceivedLgbt: true,
      perceivedAge: 18,
      perceivedLimitedEnglish: true,
      anyDisabilities: true,
      perceivedOrKnownDisability: [4, 2],
      stopReason: {
        reasonForStop: 1,
        trafficViolation: 1,
        trafficViolationCode: 54106,
        reasonableSuspicion: null,
        reasonableSuspicionCode: null,
        educationViolation: null,
        educationViolationCode: null,
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      stopResult: {
        anyActionsTaken: true,
        actionsTakenDuringStop2: true,
        actionsTakenDuringStop3: true,
        actionsTakenDuringStop4: false,
        actionsTakenDuringStop5: false,
        actionsTakenDuringStop6: false,
        actionsTakenDuringStop7: false,
        actionsTakenDuringStop8: false,
        actionsTakenDuringStop9: false,
        actionsTakenDuringStop10: false,
        actionsTakenDuringStop11: true,
        actionsTakenDuringStop12: true,
        actionsTakenDuringStop13: false,
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
  agency: 'sdsd',
  id: uniqueId(),
  officer: {
    yearsExperience: 25,
    assignment: 1,
    otherType: null,
  },
  officerId: '210518694',
  officerName: 'Steve Pietrek',
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
    piiFound: false,
    outOfCounty: false,
    city: 'BOSTONIA',
    beat: 555,
  },
  people: [
    {
      id: new Date().getTime() + '1',
      isStudent: false,
      perceivedRace: [2, 7],
      perceivedGender: 3,
      genderNonconforming: true,
      perceivedLgbt: true,
      perceivedAge: 30,
      perceivedLimitedEnglish: true,
      anyDisabilities: true,
      perceivedOrKnownDisability: [4, 2],
      stopReason: {
        reasonForStop: 1,
        trafficViolation: 1,
        trafficViolationCode: 54106,
        reasonableSuspicion: null,
        reasonableSuspicionCode: null,
        educationViolation: null,
        educationViolationCode: null,
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      stopResult: {
        anyActionsTaken: true,
        actionsTakenDuringStop2: true,
        actionsTakenDuringStop3: true,
        actionsTakenDuringStop4: false,
        actionsTakenDuringStop5: false,
        actionsTakenDuringStop6: false,
        actionsTakenDuringStop7: false,
        actionsTakenDuringStop8: false,
        actionsTakenDuringStop9: false,
        actionsTakenDuringStop10: false,
        actionsTakenDuringStop11: true,
        actionsTakenDuringStop12: true,
        actionsTakenDuringStop13: true,
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
      id: new Date().getTime() + '2',
      index: 2,
      isStudent: true,
      perceivedRace: [2],
      perceivedGender: 1,
      genderNonconforming: false,
      perceivedLgbt: false,
      perceivedAge: 18,
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
        actionsTakenDuringStop2: false,
        actionsTakenDuringStop3: true,
        actionsTakenDuringStop4: false,
        actionsTakenDuringStop5: false,
        actionsTakenDuringStop6: false,
        actionsTakenDuringStop7: false,
        actionsTakenDuringStop8: false,
        actionsTakenDuringStop9: false,
        actionsTakenDuringStop10: false,
        actionsTakenDuringStop11: true,
        actionsTakenDuringStop12: false,
        actionsTakenDuringStop13: false,
        warningCodes: [],
        citationCodes: [35152, 35154],
        infieldCodes: [],
        custodialArrestCodes: [],
      },
    },
  ],
}

export const apiStops = [
  {
    agency: 'sdsd',
    date: '2021-05-21',
    expYears: '11',
    id: '202105210817',
    isPiiFound: false,
    listPersonStopped: [
      {
        basisForSearchBrief: null,
        basisForSearchPiiFound: false,
        genderNonconforming: false,
        id: 1621599463614,
        isStudent: true,
        listActionTakenDuringStop: [
          {
            key: '23',
            action: 'Admission or written statement obtained from student',
          },
          {
            key: '1',
            action: 'Person removed from vehicle by order',
          },
          {
            key: '17',
            action: 'Asked for consent to search another person',
            personSearchConsentGiven: true,
          },
          {
            key: '19',
            action: 'Asked for consent to search property',
            propertySearchConsentGiven: true,
          },
        ],
        listBasisForPropertySeizure: [
          {
            key: '2',
            basis: 'Contraband',
          },
        ],
        listBasisForSearch: [],
        listContrabandOrEvidenceDiscovered: [
          {
            key: '5',
            contraband: 'Drugs/narcotics',
          },
          {
            key: '8',
            contraband: 'Drug paraphernalia',
          },
        ],
        listPerceivedOrKnownDisability: [
          {
            key: '7',
            disability:
              'Disability related to hyperactivity or impulsive behavior',
          },
          {
            key: '2',
            disability: 'Speech impairment or limited use of language',
          },
          {
            key: '4',
            disability: 'Mental health condition',
          },
        ],
        listPerceivedRace: [
          {
            key: '7',
            race: 'White',
          },
        ],
        listResultOfStop: [
          {
            key: '2',
            result: 'Warning (verbal or written)',
            listCodes: [
              {
                code: '54106',
                text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
              },
            ],
          },
          {
            key: '12',
            result: 'Referral to school administrator',
          },
          {
            key: '13',
            result: 'Referral to school counselor or other support staff',
          },
        ],
        listTypeOfPropertySeized: [
          {
            key: '4',
            type: 'Drugs/narcotics',
          },
          {
            key: '7',
            type: 'Drug paraphernalia',
          },
        ],
        perceivedAge: '45',
        perceivedGender: 'Male',
        perceivedLgbt: true,
        perceivedLimitedEnglish: true,
        reasonForStop: {
          key: '1',
          reason: 'Traffic Violation',
          listDetail: [
            {
              key: '1',
              reason: 'Moving Violation',
            },
          ],
          listCodes: [
            {
              code: '54106',
              text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
            },
          ],
        },
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
      {
        basisForSearchBrief: null,
        basisForSearchPiiFound: false,
        genderNonconforming: false,
        id: 1621599598723,
        isStudent: false,
        listActionTakenDuringStop: [
          {
            key: '23',
            action: 'Admission or written statement obtained from student',
          },
          {
            key: '1',
            action: 'Person removed from vehicle by order',
          },
          {
            key: '17',
            action: 'Asked for consent to search another person',
            personSearchConsentGiven: true,
          },
          {
            key: '19',
            action: 'Asked for consent to search property',
            propertySearchConsentGiven: true,
          },
        ],
        listBasisForPropertySeizure: [
          {
            key: '2',
            basis: 'Contraband',
          },
        ],
        listBasisForSearch: [],
        listContrabandOrEvidenceDiscovered: [
          {
            key: '5',
            contraband: 'Drugs/narcotics',
          },
          {
            key: '8',
            contraband: 'Drug paraphernalia',
          },
        ],
        listPerceivedOrKnownDisability: [
          {
            key: '4',
            disability: 'Mental health condition',
          },
        ],
        listPerceivedRace: [
          {
            key: '2',
            race: 'Black/African American',
          },
        ],
        listResultOfStop: [
          {
            key: '2',
            result: 'Warning (verbal or written)',
            listCodes: [
              {
                code: '54106',
                text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
              },
            ],
          },
          {
            key: '12',
            result: 'Referral to school administrator',
          },
          {
            key: '13',
            result: 'Referral to school counselor or other support staff',
          },
        ],
        listTypeOfPropertySeized: [
          {
            key: '4',
            type: 'Drugs/narcotics',
          },
          {
            key: '7',
            type: 'Drug paraphernalia',
          },
        ],
        perceivedAge: '18',
        perceivedGender: 'Male',
        perceivedLgbt: false,
        perceivedLimitedEnglish: false,
        reasonForStop: {
          key: '1',
          reason: 'Traffic Violation',
          listDetail: [
            {
              key: '1',
              reason: 'Moving Violation',
            },
          ],
          listCodes: [
            {
              code: '54106',
              text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
            },
          ],
        },
        reasonForStopExplanation: 'Speeding',
        reasonForStopPiiFound: false,
      },
    ],
    location: {
      beat: {
        codes: {
          code: '551',
          text: 'ALPINE 551',
        },
      },
      blockNumber: '1100',
      city: {
        codes: {
          code: 'ALPINE',
          text: 'ALPINE',
        },
      },
      fullAddress: '',
      highwayExit: '',
      intersection: '',
      landMark: '',
      outOfCounty: false,
      piiFound: false,
      school: true,
      schoolName: {
        codes: {
          code: '19768696023816',
          text: '138TH STREET (WISEBURN UNIFIED) 19768696023816',
        },
      },
      streetName: 'Fanning Dr',
      toggleLocationOptions: false,
    },
    officerAssignment: {
      key: '10',
      otherType: 'New Recruit Training',
      type: 'Other',
    },
    officerId: '210518694',
    officerName: 'Steve Pietrek',
    stopDateTime: '2021-05-21T12:17:00.000Z',
    stopDuration: '45',
    stopInResponseToCfs: false,
    time: '08:17',
  },
]

export const invalidApiStop1 = {
  id: '202105182150',
  ori: 'CA0370000',
  agency: 'Insight',
  officerId: '210518694',
  officerName: 'TEST',
  expYears: '12',
  officerAssignment: {
    key: '10',
    type: 'Other',
    otherType: 'New recruit training',
  },
  date: '2021-05-18',
  time: '21:50',
  stopDateTime: '2021-05-18T21:50:00',
  location: {
    toggleLocationOptions: false,
    intersection: '',
    blockNumber: '25300',
    landMark: '',
    streetName: 'Cedar Rd',
    highwayExit: '',
    city: {
      codes: {
        code: 'ALPINE',
        text: 'ALPINE',
      },
    },
    beat: null,
    school: false,
    schoolName: null,
    outOfCounty: false,
  },
  stopDuration: 30,
  stopInResponseToCFS: false,
  listPersonStopped: [
    {
      id: '1',
      isStudent: false,
      listPerceivedRace: [
        {
          race: 'White',
          key: 7,
        },
      ],
      perceivedLimitedEnglish: false,
      listPerceivedOrKnownDisability: [
        {
          disability: 'None',
          key: '8',
        },
      ],
      perceivedAge: 60,
      perceivedGender: 'Female',
      genderNonconforming: false,
      perceivedLgbt: false,
      reasonForStop: {
        key: '1',
        reason:
          'Possible conduct warranting discipline under Education Code sections 48900, 48900.2, 48900.3, 48900.4 and 48900.7',
        listDetail: [
          {
            reason: 'Moving Violation',
            key: '1',
          },
        ],
        listCodes: [
          {
            code: '54106',
            text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
          },
        ],
      },
      reasonForStopExplanation: 'Speeding',
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
      listBasisForPropertySeizure: [],
      listTypeOfPropertySeized: [],
      listResultOfStop: [
        {
          result: 'Referral to school counselor or other support staff',
          listCodes: [
            {
              code: '54106',
              text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
            },
          ],
          key: '2',
        },
      ],
    },
  ],
  listSubmission: [
    {
      id: 'd3e317ed-c17b-49ea-8364-152bb4bbcb21',
      dateSubmitted: '2021-05-13T19:25:54.2637531Z',
      status: 'Failed',
      fileName: '20210513192554_CA0370000_202105120107.json',
      error: {
        errorType: 'FileLevelFatalError',
        error:
          'Invalid file format was received. The file cannot be processed.',
        dateReported: '2021-05-14T22:16:43.1898325Z',
        fileName: '20210513192554_CA0370000_202105120107.json',
      },
    },
    {
      id: 'db2e450e-f617-410b-8869-0cd2a0b5f131',
      dateSubmitted: '2021-05-14T19:44:55.0778183Z',
      status: 'Submitted',
      fileName: '20210514194455_CA0370000_202105120107.json',
      error: null,
    },
  ],
  status: null,
  isPiiFound: false,
}

export const invalidApiStop2 = {
  id: '202105182138',
  ori: 'CA0370000',
  agency: 'Insight',
  officerId: '210518694',
  officerName: null,
  expYears: '12',
  officerAssignment: {
    key: '10',
    type: 'Other',
    otherType: 'New recruit training',
  },
  date: '2021-05-18',
  time: '21:38',
  stopDateTime: '2021-05-18T21:38:00',
  location: {
    toggleLocationOptions: false,
    intersection: '',
    blockNumber: '25300',
    landMark: '',
    streetName: 'Cedar Rd',
    highwayExit: '',
    city: {
      codes: {
        code: 'ALPINE',
        text: 'ALPINE',
      },
    },
    beat: null,
    school: false,
    schoolName: null,
    outOfCounty: false,
  },
  stopDuration: 30,
  stopInResponseToCFS: false,
  listPersonStopped: [
    {
      id: '1',
      isStudent: false,
      listPerceivedRace: [
        {
          race: 'White',
          key: 7,
        },
      ],
      perceivedLimitedEnglish: false,
      listPerceivedOrKnownDisability: [
        {
          disability: 'None',
          key: '8',
        },
      ],
      perceivedAge: 60,
      perceivedGender: 'Female',
      genderNonconforming: false,
      perceivedLgbt: false,
      reasonForStop: {
        key: '1',
        reason:
          'Possible conduct warranting discipline under Education Code sections 48900, 48900.2, 48900.3, 48900.4 and 48900.7',
        listDetail: [
          {
            reason: 'Moving Violation',
            key: '1',
          },
        ],
        listCodes: [
          {
            code: '54106',
            text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
          },
        ],
      },
      reasonForStopExplanation: 'Speeding',
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
      listBasisForPropertySeizure: [],
      listTypeOfPropertySeized: [],
      listResultOfStop: [
        {
          result: 'Referral to school counselor or other support staff',
          listCodes: [
            {
              code: '54106',
              text: '22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106',
            },
          ],
          key: '2',
        },
      ],
    },
  ],
  listSubmission: [
    {
      id: '3586b28f-dc1b-4658-83f9-3939f550fd3c',
      dateSubmitted: '2021-06-01T20:28:49.1649343Z',
      status: 'Failed',
      fileName: '20210601202849_CA0370000_202105182138.json',
      listSubmissionError: [
        {
          errorType: 'RecordLevelError',
          message:
            'DV039_1_Gend::Perceived Gender entry is invalid. If applicable, only one choice can be selected from values 1 - 4.  * After submission, perception data is locked and cannot be changed. Please ensure your local system maps/uses the valid data values. For further assistance, contact DOJ.',
          code: 'DV039_1_Gend::Perceived Gender entry is invalid. If applicable, only one choice can be selected from values 1',
          dateReported: '2021-06-02T09:28:41.4057397Z',
          fileName: '20210601202849_CA0370000_202105182138.json',
        },
      ],
    },
  ],
  status: 'Failed',
  isPiiFound: false,
}
