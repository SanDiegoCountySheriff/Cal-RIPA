<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'personSearchAutomaticallySelected',
      'propertySearchAutomaticallySelected',
    ]),
  },
  methods: {
    ...mapActions([
      'setPersonSearchAutomaticallySelected',
      'setPropertySearchAutomaticallySelected',
    ]),

    clearContrabandOrEvidenceDiscoveredModel() {
      this.$nextTick(() => {
        this.model.actionsTaken.contrabandOrEvidenceDiscovered = []
      })
    },

    updateModel() {
      // this.updateSchoolModel()
      // this.updateStudentModel()
      // this.updateMoreLocationOptionsModel()
      // this.updatePerceivedDisabilityModel()
      // this.updateActionsTakenModel()
      // this.updateActionsTakenSearchModel()
      // this.updateBasisForSearchModel()
      // this.updateBasisForPropertySeizureModel()
      // this.updateBlockNumberModel()
      // this.updateFullAddressModel()
      // this.updatePerceivedLgbtModel()
      // this.updatePropertyWasSeizedModel()
      // stop = this.updateStopReasonSearchModel(stop)
      // this.updateStopReasonModel()
      this.updateStopResultModel()
    },

    // updateMoreLocationOptionsModel() {
    //   if (!this.model.location.toggleLocationOptions) {
    //     this.model.location.highwayExit = null
    //     this.model.location.landmark = null
    //   }
    // },

    // updateActionsTakenModel() {
    //   if (!this.model.actionsTaken.anyActionsTaken) {
    //     this.model.actionsTaken.actionsTakenDuringStop = null
    //     this.model.actionsTaken.propertyWasSeized = false
    //     this.model.actionsTaken.personSearchConsentGiven = false
    //     this.model.actionsTaken.propertySearchConsentGiven = false
    //     this.model.actionsTaken.basisForSearch = []
    //     this.model.actionsTaken.basisForSearchExplanation = null
    //     this.model.actionsTaken.basisForSearchPiiFound = false
    //   }

    //   // if (!this.model.person.isStudent) {
    //   //   if (
    //   //     this.model.actionsTaken.actionsTakenDuringStop !== null &&
    //   //     this.model.actionsTaken.actionsTakenDuringStop.length > 0
    //   //   ) {
    //   //     this.model.actionsTaken.actionsTakenDuringStop =
    //   //       this.model.actionsTaken.actionsTakenDuringStop.filter(
    //   //         item => item !== 23,
    //   //       )
    //   //   }
    //   // }
    // },

    // updateActionsTakenSearchModel() {
    //   const actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []

    //   if (actionsTaken.includes(18) && !this.model.stopReason.searchOfPerson) {
    //     this.setPersonSearchAutomaticallySelected(false)
    //   }

    //   if (
    //     actionsTaken.includes(20) &&
    //     !this.model.stopReason.searchOfProperty
    //   ) {
    //     this.setPropertySearchAutomaticallySelected(false)
    //   }

    //   if (this.model.stopReason) {
    //     if (this.model.stopReason.searchOfPerson) {
    //       this.isAnyActionsTakenDisabled1 = true
    //       this.model.actionsTaken.anyActionsTaken = true
    //       if (!actionsTaken.includes(18)) {
    //         if (this.model.actionsTaken.actionsTakenDuringStop === null) {
    //           this.model.actionsTaken.actionsTakenDuringStop = []
    //         }
    //         this.model.actionsTaken.actionsTakenDuringStop.push(18)
    //         this.setPersonSearchAutomaticallySelected(true)
    //       }
    //     }
    //     if (this.model.stopReason.searchOfProperty) {
    //       this.isAnyActionsTakenDisabled2 = true
    //       this.model.actionsTaken.anyActionsTaken = true
    //       if (!actionsTaken.includes(20)) {
    //         if (this.model.actionsTaken.actionsTakenDuringStop === null) {
    //           this.model.actionsTaken.actionsTakenDuringStop = []
    //         }
    //         this.model.actionsTaken.actionsTakenDuringStop.push(20)
    //         this.setPropertySearchAutomaticallySelected(true)
    //       }
    //     }
    //   }

    //   if (!actionsTaken.includes(17)) {
    //     this.model.actionsTaken.personSearchConsentGiven = false
    //   }

    //   if (!actionsTaken.includes(19)) {
    //     this.model.actionsTaken.propertySearchConsentGiven = false
    //   }

    //   if (!actionsTaken.includes(18) && !actionsTaken.includes(20)) {
    //     this.model.actionsTaken.basisForSearch = []
    //     this.model.actionsTaken.basisForSearchExplanation = null
    //     this.model.actionsTaken.basisForSearchPiiFound = false
    //   }
    // },

    // updateBasisForSearchModel() {
    //   if (
    //     this.model.actionsTaken.basisForSearch !== null &&
    //     this.model.actionsTaken.basisForSearch.length === 1 &&
    //     this.model.actionsTaken.basisForSearch.includes(4)
    //   ) {
    //     this.model.actionsTaken.basisForSearchExplanation = null
    //     this.model.actionsTaken.basisForSearchPiiFound = false
    //   }

    //   const actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []
    //   if (
    //     !actionsTaken.includes(20) &&
    //     this.model.actionsTaken.basisForSearch !== null &&
    //     this.model.actionsTaken.basisForSearch.length > 0
    //   ) {
    //     this.model.actionsTaken.basisForSearch =
    //       this.model.actionsTaken.basisForSearch.filter(item => item !== 12)
    //   }
    // },

    // updateBasisForPropertySeizureModel() {
    //   if (!this.model.actionsTaken.basisForPropertySeizure) {
    //     return
    //   }

    //   if (
    //     this.model.actionsTaken.basisForPropertySeizure.includes(2) ||
    //     this.model.actionsTaken.basisForPropertySeizure.includes(3)
    //   ) {
    //     this.model.actionsTaken.anyContraband = true
    //   }

    //   if (!this.model.person.isStudent) {
    //     if (
    //       this.model.actionsTaken.basisForSearch !== null &&
    //       this.model.actionsTaken.basisForSearch.length > 0
    //     ) {
    //       this.model.actionsTaken.basisForSearch =
    //         this.model.actionsTaken.basisForSearch.filter(item => item !== 13)
    //     }
    //     if (
    //       this.model.actionsTaken.basisForPropertySeizure !== null &&
    //       this.model.actionsTaken.basisForPropertySeizure.length > 0
    //     ) {
    //       this.model.actionsTaken.basisForPropertySeizure =
    //         this.model.actionsTaken.basisForPropertySeizure.filter(
    //           item => item !== 6,
    //         )
    //     }
    //   }
    // },

    // parseBlockNumber(value) {
    //   let blockNumber = value
    //   if (blockNumber !== null && blockNumber.length > 0) {
    //     const calcBlockNumber = Math.floor(Number(blockNumber) / 100) * 100
    //     blockNumber = calcBlockNumber
    //   }

    //   const result =
    //     typeof blockNumber === 'string' ||
    //     (typeof blockNumber === 'number' && !isNaN(blockNumber))
    //       ? blockNumber.toString()
    //       : null

    //   return result
    // },

    // updateBlockNumberModel() {
    //   this.model.location.blockNumber = this.parseBlockNumber(
    //     this.model.location.blockNumber,
    //   )
    // },

    // updateFullAddressModel() {
    //   const streetName = this.model.location?.streetName || ''
    //   const highwayExit = this.model.location?.highwayExit || ''
    //   const intersection = this.model.location?.intersection || ''
    //   const landMark = this.model.location?.landMark || ''
    //   const fullAddress =
    //     streetName + ' ' + highwayExit + ' ' + intersection + ' ' + landMark
    //   this.model.location.fullAddress = fullAddress
    // },

    // updatePerceivedLgbtModel() {
    //   if (this.model.stopVersion === 1) {
    //     this.model.person.perceivedSexualOrientation = null
    //     if (
    //       this.model.person.perceivedGender === 3 ||
    //       this.model.person.perceivedGender === 4
    //     ) {
    //       this.model.person.perceivedLgbt = true
    //     }
    //   } else {
    //     this.model.person.perceivedLgbt = null
    //   }
    // },

    // updatePropertyWasSeizedModel() {
    //   const actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []

    //   if (!this.model.actionsTaken.propertyWasSeized) {
    //     this.model.actionsTaken.basisForPropertySeizure = []
    //     this.model.actionsTaken.typeOfPropertySeized = null
    //     this.model.actionsTaken.actionsTakenDuringStop = actionsTaken.filter(
    //       item => item !== 21,
    //     )
    //   } else {
    //     if (!actionsTaken.includes(21)) {
    //       if (this.model.actionsTaken.actionsTakenDuringStop === null) {
    //         this.model.actionsTaken.actionsTakenDuringStop = []
    //       }
    //       this.model.actionsTaken.actionsTakenDuringStop.push(21)
    //     }
    //   }
    // },

    // updateSchoolModel() {
    //   if (!this.model.location.isSchool) {
    //     this.model.location.school = null
    //     this.model.person.isStudent = false
    //     this.model.stopResult.resultsOfStop12 = false
    //     this.model.stopResult.resultsOfStop13 = false
    //   }
    // },

    // updateStudentModel() {
    //   if (!this.model.person.isStudent) {
    //     this.model.stopResult.resultsOfStop12 = false
    //     this.model.stopResult.resultsOfStop13 = false
    //   }
    // },

    // updatePerceivedDisabilityModel() {
    //   if (!this.model.person.isStudent) {
    //     const options = this.model.person?.perceivedOrKnownDisability || []
    //     const studentOptionFound = options.includes(7)
    //     if (studentOptionFound) {
    //       this.model.person.perceivedOrKnownDisability = options.filter(
    //         item => item !== 7,
    //       )
    //     }
    //   }

    //   if (!this.model.person.anyDisabilities) {
    //     this.model.person.perceivedOrKnownDisability = []
    //   }
    // },

    // removeActionsTakenPersonSearch() {
    //   this.model.actionsTaken.actionsTakenDuringStop =
    //     this.model.actionsTaken.actionsTakenDuringStop.filter(
    //       item => item !== 18,
    //     )
    // },

    // removeActionsTakenPropertySearch() {
    //   this.model.actionsTaken.actionsTakenDuringStop =
    //     this.model.actionsTaken.actionsTakenDuringStop.filter(
    //       item => item !== 20,
    //     )
    // },

    // updateStopReasonModel() {
    //   // if (!this.model.person.isStudent) {
    //   //   if (
    //   //     this.model.stopReason.reasonForStop === 7 ||
    //   //     this.model.stopReason.reasonForStop === 8
    //   //   ) {
    //   //     this.model.stopReason.reasonForStop = null
    //   //     this.model.stopReason.educationViolation = null
    //   //     this.model.stopReason.educationViolationCode = null
    //   //   }
    //   // }

    //   if (this.model.stopReason.reasonForStop === 1) {
    //     this.model.stopReason.educationViolation = null
    //     this.model.stopReason.educationViolationCode = null
    //     this.model.stopReason.reasonableSuspicion = []
    //     this.model.stopReason.reasonableSuspicionCode = null
    //     if (this.personSearchAutomaticallySelected) {
    //       this.removeActionsTakenPersonSearch()
    //     }
    //     if (this.propertySearchAutomaticallySelected) {
    //       this.removeActionsTakenPropertySearch()
    //     }
    //   }

    //   if (this.model.stopReason.reasonForStop === 2) {
    //     this.model.stopReason.educationViolation = null
    //     this.model.stopReason.educationViolationCode = null
    //     this.model.stopReason.trafficViolation = null
    //     this.model.stopReason.trafficViolationCode = null
    //     if (this.personSearchAutomaticallySelected) {
    //       this.removeActionsTakenPersonSearch()
    //     }
    //     if (this.propertySearchAutomaticallySelected) {
    //       this.removeActionsTakenPropertySearch()
    //     }
    //   }

    //   if (this.model.stopReason.reasonForStop === 7) {
    //     this.model.stopReason.reasonableSuspicion = []
    //     this.model.stopReason.reasonableSuspicionCode = null
    //     this.model.stopReason.trafficViolation = null
    //     this.model.stopReason.trafficViolationCode = null
    //     if (this.personSearchAutomaticallySelected) {
    //       this.removeActionsTakenPersonSearch()
    //     }
    //     if (this.propertySearchAutomaticallySelected) {
    //       this.removeActionsTakenPropertySearch()
    //     }
    //   }

    //   if (this.model.stopReason.reasonForStop === 7) {
    //     if (this.model.stopReason.educationViolation !== 1) {
    //       this.model.stopReason.educationViolationCode = null
    //     }
    //     if (this.personSearchAutomaticallySelected) {
    //       this.removeActionsTakenPersonSearch()
    //     }
    //     if (this.propertySearchAutomaticallySelected) {
    //       this.removeActionsTakenPropertySearch()
    //     }
    //   }

    //   if (
    //     this.model.stopReason.reasonForStop === 3 ||
    //     this.model.stopReason.reasonForStop === 4 ||
    //     this.model.stopReason.reasonForStop === 5 ||
    //     this.model.stopReason.reasonForStop === 8
    //   ) {
    //     this.model.stopReason.educationViolation = null
    //     this.model.stopReason.educationViolationCode = null
    //     this.model.stopReason.reasonableSuspicion = []
    //     this.model.stopReason.reasonableSuspicionCode = null
    //     this.model.stopReason.trafficViolation = null
    //     this.model.stopReason.trafficViolationCode = null
    //     if (this.personSearchAutomaticallySelected) {
    //       this.removeActionsTakenPersonSearch()
    //     }
    //     if (this.propertySearchAutomaticallySelected) {
    //       this.removeActionsTakenPropertySearch()
    //     }
    //   }

    //   if (this.model.stopReason.reasonForStop === 6) {
    //     this.model.stopReason.educationViolation = null
    //     this.model.stopReason.educationViolationCode = null
    //     this.model.stopReason.reasonableSuspicion = []
    //     this.model.stopReason.reasonableSuspicionCode = null
    //     this.model.stopReason.trafficViolation = null
    //     this.model.stopReason.trafficViolationCode = null
    //   }
    // },

    // updateStopReasonSearchModel(stop) {
    //   if (stop.stopReason.reasonForStop !== 6) {
    //     stop.stopReason.searchOfPerson = false
    //     stop.stopReason.searchOfProperty = false
    //   }

    //   if (stop.stopReason.reasonForStop === 6) {
    //     const actionsTaken = stop.actionsTaken?.actionsTakenDuringStop || []
    //     if (stop.stopReason.searchOfPerson) {
    //       stop.actionsTaken.anyActionsTaken = true
    //       if (!actionsTaken.includes(18)) {
    //         if (stop.actionsTaken.actionsTakenDuringStop === null) {
    //           stop.actionsTaken.actionsTakenDuringStop = []
    //         }
    //         stop.actionsTaken.actionsTakenDuringStop.push(18)
    //       }
    //     } else {
    //       if (
    //         stop.actionsTaken.actionsTakenDuringStop !== null &&
    //         stop.actionsTaken.actionsTakenDuringStop.length > 0
    //       ) {
    //         stop.actionsTaken.actionsTakenDuringStop =
    //           stop.actionsTaken.actionsTakenDuringStop.filter(
    //             item => item !== 18,
    //           )
    //       }
    //     }
    //     if (stop.stopReason.searchOfProperty) {
    //       stop.actionsTaken.anyActionsTaken = true
    //       if (!actionsTaken.includes(20)) {
    //         if (stop.actionsTaken.actionsTakenDuringStop === null) {
    //           stop.actionsTaken.actionsTakenDuringStop = []
    //         }
    //         stop.actionsTaken.actionsTakenDuringStop.push(20)
    //       }
    //     } else {
    //       if (
    //         stop.actionsTaken.actionsTakenDuringStop !== null &&
    //         stop.actionsTaken.actionsTakenDuringStop.length > 0
    //       ) {
    //         stop.actionsTaken.actionsTakenDuringStop =
    //           stop.actionsTaken.actionsTakenDuringStop.filter(
    //             item => item !== 20,
    //           )
    //       }
    //     }
    //   }
    // },

    updateStopResultModel() {
      if (!this.model.stopResult.anyResultsOfStop) {
        this.model.stopResult.resultsOfStop2 = false
        this.model.stopResult.resultsOfStop3 = false
        this.model.stopResult.resultsOfStop4 = false
        this.model.stopResult.resultsOfStop5 = false
        this.model.stopResult.resultsOfStop6 = false
        this.model.stopResult.resultsOfStop7 = false
        this.model.stopResult.resultsOfStop8 = false
        this.model.stopResult.resultsOfStop9 = false
        this.model.stopResult.resultsOfStop10 = false
        this.model.stopResult.resultsOfStop11 = false
        this.model.stopResult.resultsOfStop12 = false
        this.model.stopResult.resultsOfStop13 = false
      }

      if (!this.model.stopResult.resultsOfStop2) {
        this.model.stopResult.warningCodes = []
      }

      if (!this.model.stopResult.resultsOfStop3) {
        this.model.stopResult.citationCodes = []
      }

      if (!this.model.stopResult.resultsOfStop4) {
        this.model.stopResult.infieldCodes = []
      }

      if (!this.model.stopResult.resultsOfStop6) {
        this.model.stopResult.custodialArrestCodes = []
      }
    },
  },
}
</script>
