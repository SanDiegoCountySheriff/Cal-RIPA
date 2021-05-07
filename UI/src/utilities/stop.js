import { format } from 'date-fns'

export const defaultStop = () => {
  return {
    person: {
      id: new Date().getTime(),
    },
  }
}

export const motorStop = () => {
  return {
    officer: {
      editOfficer: false,
      yearsExperience: this.getOfficerYearsExperience(),
      assignment: this.getOfficerAssignment(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm'),
    },
    person: {
      id: new Date().getTime(),
    },
    stopReason: {
      reasonForStop: 1,
      trafficViolation: 1,
      trafficViolationCode: 54106,
      reasonForStopExplanation: 'Speeding',
    },
    actionsTaken: {},
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
      citationCodes: [54106],
      infieldCodes: [],
      custodialArrestCodes: [],
    },
  }
}

export const probationStop = () => {
  return {
    officer: {
      editOfficer: false,
      yearsExperience: this.getOfficerYearsExperience(),
      assignment: this.getOfficerAssignment(),
    },
    stopDate: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm'),
    },
    person: {
      id: new Date().getTime(),
    },
    stopReason: {
      reasonForStop: 3,
      reasonForStopExplanation:
        'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
    },
    actionsTaken: {
      anyActionsTaken: true,
      actionsTakenDuringStop: [4, 18, 20],
      basisForSearch: [4],
    },
  }
}
