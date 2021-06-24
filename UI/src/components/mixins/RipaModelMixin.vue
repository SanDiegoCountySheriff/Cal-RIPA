<script>
import { format } from 'date-fns'

export default {
  methods: {
    updateModel(newValue) {
      return {
        id: newValue.id,
        template: newValue.template,
        editStopExplanation: newValue.editStopExplanation || null,
        stepTrace: newValue.stepTrace || [],
        actionsTaken: {
          anyActionsTaken: newValue.actionsTaken?.anyActionsTaken || false,
          actionsTakenDuringStop:
            newValue.actionsTaken?.actionsTakenDuringStop || [],
          personSearchConsentGiven:
            newValue.actionsTaken?.personSearchConsentGiven || false,
          propertySearchConsentGiven:
            newValue.actionsTaken?.propertySearchConsentGiven || false,
          basisForSearch: newValue.actionsTaken?.basisForSearch || [],
          basisForSearchExplanation:
            newValue.actionsTaken?.basisForSearchExplanation || null,
          basisForSearchPiiFound:
            newValue.actionsTaken?.basisForSearchPiiFound || false,
          propertyWasSeized: newValue.actionsTaken?.propertyWasSeized || false,
          basisForPropertySeizure:
            newValue.actionsTaken?.basisForPropertySeizure || [],
          typeOfPropertySeized:
            newValue.actionsTaken?.typeOfPropertySeized || [],
          anyContraband: newValue.actionsTaken?.anyContraband || false,
          contrabandOrEvidenceDiscovered:
            newValue.actionsTaken?.contrabandOrEvidenceDiscovered || [],
        },
        location: {
          isSchool: newValue.location?.isSchool || false,
          school: newValue.location?.school || null,
          blockNumber: newValue.location?.blockNumber || null,
          streetName: newValue.location?.streetName || null,
          intersection: newValue.location?.intersection || null,
          toggleLocationOptions:
            newValue.location?.toggleLocationOptions || false,
          highwayExit: newValue.location?.highwayExit || null,
          landmark: newValue.location?.landmark || null,
          piiFound: newValue.location?.piiFound || false,
          outOfCounty: newValue.location?.outOfCounty || false,
          city: newValue.location?.city || null,
          beat: newValue.location?.beat || null,
        },
        person: {
          anyDisabilities: newValue.person?.anyDisabilities || false,
          id: newValue.person?.id,
          index: newValue.person?.index,
          isStudent: newValue.person?.isStudent || false,
          perceivedAge: newValue.person?.perceivedAge || null,
          perceivedGender: newValue.person?.perceivedGender || null,
          genderNonconforming: newValue.person?.genderNonconforming || false,
          perceivedLimitedEnglish:
            newValue.person?.perceivedLimitedEnglish || false,
          perceivedLgbt: newValue.person?.perceivedLgbt || false,
          perceivedOrKnownDisability:
            newValue.person?.perceivedOrKnownDisability || [],
          perceivedRace: newValue.person?.perceivedRace || [],
        },
        stopDate: {
          date: newValue.stopDate?.date || format(new Date(), 'yyyy-MM-dd'),
          time: newValue.stopDate?.time || format(new Date(), 'kk:mm'),
          duration: newValue.stopDate?.duration || null,
          stopInResponseToCfs: newValue.stopDate?.stopInResponseToCfs || false,
        },
        stopReason: {
          reasonForStop: newValue.stopReason?.reasonForStop || null,
          educationViolation: newValue.stopReason?.educationViolation || null,
          educationViolationCode:
            newValue.stopReason?.educationViolationCode || null,
          trafficViolation: newValue.stopReason?.trafficViolation || null,
          trafficViolationCode:
            newValue.stopReason?.trafficViolationCode || null,
          reasonableSuspicion: newValue.stopReason?.reasonableSuspicion || [],
          reasonableSuspicionCode:
            newValue.stopReason?.reasonableSuspicionCode || null,
          searchOfPerson: newValue.stopReason?.searchOfPerson || null,
          searchOfProperty: newValue.stopReason?.searchOfProperty || null,
          reasonForStopExplanation:
            newValue.stopReason?.reasonForStopExplanation || null,
          reasonForStopPiiFound:
            newValue.stopReason?.reasonForStopPiiFound || false,
        },
        stopResult: {
          anyResultsOfStop: newValue.stopResult?.anyResultsOfStop || false,
          resultsOfStop2: newValue.stopResult?.resultsOfStop2 || false,
          resultsOfStop3: newValue.stopResult?.resultsOfStop3 || false,
          resultsOfStop4: newValue.stopResult?.resultsOfStop4 || false,
          resultsOfStop5: newValue.stopResult?.resultsOfStop5 || false,
          resultsOfStop6: newValue.stopResult?.resultsOfStop6 || false,
          resultsOfStop7: newValue.stopResult?.resultsOfStop7 || false,
          resultsOfStop8: newValue.stopResult?.resultsOfStop8 || false,
          resultsOfStop9: newValue.stopResult?.resultsOfStop9 || false,
          resultsOfStop10: newValue.stopResult?.resultsOfStop10 || false,
          resultsOfStop11: newValue.stopResult?.resultsOfStop11 || false,
          resultsOfStop12: newValue.stopResult?.resultsOfStop12 || false,
          resultsOfStop13: newValue.stopResult?.resultsOfStop13 || false,
          warningCodes: newValue.stopResult?.warningCodes || [],
          citationCodes: newValue.stopResult?.citationCodes || [],
          infieldCodes: newValue.stopResult?.infieldCodes || [],
          custodialArrestCodes: newValue.stopResult?.custodialArrestCodes || [],
          pullFromReasonCode: newValue.stopResult?.pullFromReasonCode || false,
        },
        agencyQuestions: newValue.agencyQuestions || [],
      }
    },

    clearContrabandOrEvidenceDiscoveredModel() {
      this.$nextTick(() => {
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = []
      })
    },

    clearDisabilityModel() {
      this.viewModel.person.anyDisabilities = false
    },

    clearPerceivedOrKnownDisabilityModel() {
      this.$nextTick(() => {
        this.viewModel.person.perceivedOrKnownDisability = []
      })
    },

    updateActionsTakenModel() {
      if (!this.viewModel.actionsTaken.anyActionsTaken) {
        this.viewModel.actionsTaken.actionsTakenDuringStop = null
        this.viewModel.actionsTaken.propertyWasSeized = false
        this.viewModel.actionsTaken.personSearchConsentGiven = false
        this.viewModel.actionsTaken.propertySearchConsentGiven = false
        this.viewModel.actionsTaken.basisForSearch = null
        this.viewModel.actionsTaken.basisForSearchExplanation = null
        this.viewModel.actionsTaken.basisForSearchPiiFound = false
      }
    },

    updateActionsTakenSearchModel() {
      if (this.viewModel.stopReason) {
        if (this.viewModel.stopReason.searchOfPerson) {
          this.isAnyActionsTakenDisabled1 = true
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(18) ===
            -1
          ) {
            if (this.viewModel.actionsTaken.actionsTakenDuringStop === null) {
              this.viewModel.actionsTaken.actionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(18)
          }
        }
        if (this.viewModel.stopReason.searchOfProperty) {
          this.isAnyActionsTakenDisabled2 = true
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(20) ===
            -1
          ) {
            if (this.viewModel.actionsTaken.actionsTakenDuringStop === null) {
              this.viewModel.actionsTaken.actionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(20)
          }
        }
      }

      if (
        this.viewModel.actionsTaken.actionsTakenDuringStop &&
        !this.viewModel.actionsTaken.actionsTakenDuringStop.includes(17)
      ) {
        this.viewModel.actionsTaken.personSearchConsentGiven = false
      }

      if (
        this.viewModel.actionsTaken.actionsTakenDuringStop &&
        !this.viewModel.actionsTaken.actionsTakenDuringStop.includes(19)
      ) {
        this.viewModel.actionsTaken.propertySearchConsentGiven = false
      }

      const actionsTaken =
        this.viewModel.actionsTaken?.actionsTakenDuringStop || []
      if (!actionsTaken.includes(18) && !actionsTaken.includes(20)) {
        this.viewModel.actionsTaken.basisForSearch = null
        this.viewModel.actionsTaken.basisForSearchExplanation = null
        this.viewModel.actionsTaken.basisForSearchPiiFound = false
      }
    },

    updateBasisForSearchModel() {
      if (
        this.viewModel.actionsTaken.basisForSearch !== null &&
        this.viewModel.actionsTaken.basisForSearch.length === 1 &&
        this.viewModel.actionsTaken.basisForSearch.includes(4)
      ) {
        this.viewModel.actionsTaken.basisForSearchExplanation = null
        this.viewModel.actionsTaken.basisForSearchPiiFound = false
      }
    },

    updateBasisForPropertySeizureModel() {
      if (!this.viewModel.actionsTaken.basisForPropertySeizure) {
        return
      }

      if (
        this.viewModel.actionsTaken.basisForPropertySeizure.includes(2) ||
        this.viewModel.actionsTaken.basisForPropertySeizure.includes(3)
      ) {
        this.viewModel.actionsTaken.anyContraband = true
      }
    },

    updateBlockNumberModel() {
      let blockNumber = this.viewModel.location.blockNumber
      blockNumber = Math.floor(blockNumber / 100) * 100
      this.viewModel.location.blockNumber = blockNumber
    },

    updateFullAddressModel() {
      const streetName = this.viewModel.location?.streetName || ''
      const highwayExit = this.viewModel.location?.highwayExit || ''
      const intersection = this.viewModel.location?.intersection || ''
      const landMark = this.viewModel.location?.landMark || ''
      const fullAddress =
        streetName + ' ' + highwayExit + ' ' + intersection + ' ' + landMark
      this.viewModel.location.fullAddress = fullAddress
    },

    updateOutOfCountyModel() {
      this.$nextTick(() => {
        if (this.viewModel.location.outOfCounty) {
          this.viewModel.location.beat = 999
          this.viewModel.location.city = null
        }

        if (
          !this.viewModel.location.outOfCounty &&
          this.viewModel.location.beat === 999
        ) {
          this.viewModel.location.beat = null
          this.viewModel.location.city = null
        }
      })
    },

    updatePerceivedLgbtModel() {
      if (
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4
      ) {
        this.viewModel.person.perceivedLgbt = true
      }
    },

    updatePropertyWasSeizedModel() {
      if (!this.viewModel.actionsTaken.propertyWasSeized) {
        this.viewModel.actionsTaken.basisForPropertySeizure = null
        this.viewModel.actionsTaken.typeOfPropertySeized = null
        this.viewModel.actionsTaken.anyContraband = false
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = null
      }

      if (this.viewModel.actionsTaken.propertyWasSeized) {
        this.viewModel.actionsTaken.anyContraband = true
      }
    },

    updateSchoolModel() {
      if (!this.viewModel.location.isSchool) {
        this.viewModel.person.isStudent = false
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
        this.updateStopReasonModel()
      }
    },

    updateStopReasonModel() {
      if (!this.viewModel.person.isStudent) {
        if (
          this.viewModel.stopReason.reasonForStop === 7 ||
          this.viewModel.stopReason.reasonForStop === 8
        ) {
          this.viewModel.stopReason.reasonForStop = null
          this.viewModel.stopReason.educationViolation = null
          this.viewModel.stopReason.educationViolationCode = null
        }
      }

      if (this.viewModel.stopReason.reasonForStop === 1) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.reasonableSuspicion = null
        this.viewModel.stopReason.reasonableSuspicionCode = null
      }

      if (this.viewModel.stopReason.reasonForStop === 2) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
      }

      if (this.viewModel.stopReason.reasonForStop === 7) {
        this.viewModel.stopReason.reasonableSuspicion = null
        this.viewModel.stopReason.reasonableSuspicionCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
      }

      if (this.viewModel.stopReason.reasonForStop === 7) {
        if (this.viewModel.stopReason.educationViolation !== 1) {
          this.viewModel.stopReason.educationViolationCode = null
        }
      }
    },

    updateStopReasonSearchModel() {
      if (this.viewModel.stopReason.reasonForStop !== 6) {
        this.viewModel.stopReason.searchOfPerson = false
        this.viewModel.stopReason.searchOfProperty = false
      }

      if (this.viewModel.stopReason.reasonForStop === 6) {
        if (this.viewModel.stopReason.searchOfPerson) {
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(18) ===
            -1
          ) {
            if (this.viewModel.actionsTaken.actionsTakenDuringStop === null) {
              this.viewModel.actionsTaken.actionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(18)
          }
        } else {
          if (this.viewModel.actionsTaken.actionsTakenDuringStop) {
            this.viewModel.actionsTaken.actionsTakenDuringStop =
              this.viewModel.actionsTaken.actionsTakenDuringStop.filter(
                item => item !== 18,
              )
          }
        }
        if (this.viewModel.stopReason.searchOfProperty) {
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(20) ===
            -1
          ) {
            if (this.viewModel.actionsTaken.actionsTakenDuringStop === null) {
              this.viewModel.actionsTaken.actionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(20)
          }
        } else {
          if (this.viewModel.actionsTaken.actionsTakenDuringStop) {
            this.viewModel.actionsTaken.actionsTakenDuringStop =
              this.viewModel.actionsTaken.actionsTakenDuringStop.filter(
                item => item !== 20,
              )
          }
        }
      }
    },

    updateStopResultModel() {
      if (!this.viewModel.person.isStudent) {
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
      }

      if (!this.viewModel.stopResult.anyResultsOfStop) {
        this.viewModel.stopResult.resultsOfStop2 = false
        this.viewModel.stopResult.resultsOfStop3 = false
        this.viewModel.stopResult.resultsOfStop4 = false
        this.viewModel.stopResult.resultsOfStop5 = false
        this.viewModel.stopResult.resultsOfStop6 = false
        this.viewModel.stopResult.resultsOfStop7 = false
        this.viewModel.stopResult.resultsOfStop8 = false
        this.viewModel.stopResult.resultsOfStop9 = false
        this.viewModel.stopResult.resultsOfStop10 = false
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
      }
    },

    updateStopResultWarningCodesModel() {
      if (!this.viewModel.stopResult.resultsOfStop2) {
        this.viewModel.stopResult.warningCodes = null
      }
    },

    updateStopResultCitationCodesModel() {
      if (!this.viewModel.stopResult.resultsOfStop3) {
        this.viewModel.stopResult.citationCodes = null
      }
    },

    updateStopResultInfieldCodesModel() {
      if (!this.viewModel.stopResult.resultsOfStop4) {
        this.viewModel.stopResult.infieldCodes = null
      }
    },

    updateStopResultCustodiaArrestCodesModel() {
      if (!this.viewModel.stopResult.resultsOfStop6) {
        this.viewModel.stopResult.custodialArrestCodes = null
      }
    },
  },

  props: {
    onOpenStatute: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
