<script>
import { format } from 'date-fns'

export default {
  methods: {
    updateModel(newValue) {
      const updatedBlockNumber =
        newValue.location?.blockNumber || newValue.location?.blockNumber === 0
          ? newValue.location?.blockNumber
          : null

      return {
        id: newValue.id,
        template: newValue.template,
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
          blockNumber: updatedBlockNumber,
          streetName: newValue.location?.streetName || null,
          intersection: newValue.location?.intersection || null,
          moreLocationOptions: newValue.location?.moreLocationOptions || false,
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
          anyActionsTaken: newValue.stopResult?.anyActionsTaken || false,
          actionsTakenDuringStop2:
            newValue.stopResult?.actionsTakenDuringStop2 || false,
          actionsTakenDuringStop3:
            newValue.stopResult?.actionsTakenDuringStop3 || false,
          actionsTakenDuringStop4:
            newValue.stopResult?.actionsTakenDuringStop4 || false,
          actionsTakenDuringStop5:
            newValue.stopResult?.actionsTakenDuringStop5 || false,
          actionsTakenDuringStop6:
            newValue.stopResult?.actionsTakenDuringStop6 || false,
          actionsTakenDuringStop7:
            newValue.stopResult?.actionsTakenDuringStop7 || false,
          actionsTakenDuringStop8:
            newValue.stopResult?.actionsTakenDuringStop8 || false,
          actionsTakenDuringStop9:
            newValue.stopResult?.actionsTakenDuringStop9 || false,
          actionsTakenDuringStop10:
            newValue.stopResult?.actionsTakenDuringStop10 || false,
          actionsTakenDuringStop11:
            newValue.stopResult?.actionsTakenDuringStop11 || false,
          actionsTakenDuringStop12:
            newValue.stopResult?.actionsTakenDuringStop12 || false,
          actionsTakenDuringStop13:
            newValue.stopResult?.actionsTakenDuringStop13 || false,
          warningCodes: newValue.stopResult?.warningCodes || [],
          citationCodes: newValue.stopResult?.citationCodes || [],
          infieldCodes: newValue.stopResult?.infieldCodes || [],
          custodialArrestCodes: newValue.stopResult?.custodialArrestCodes || [],
          pullFromReasonCode: newValue.stopResult?.pullFromReasonCode || false,
        },
        agencyQuestions: newValue.agencyQuestions || [],
      }
    },

    updateSchoolModel() {
      if (!this.viewModel.location.isSchool) {
        this.viewModel.person.isStudent = false
      }
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

    updateBlockNumberModel() {
      this.$nextTick(() => {
        let blockNumber = this.viewModel.location.blockNumber
        blockNumber = Math.floor(blockNumber / 100) * 100
        this.viewModel.location.blockNumber = blockNumber
      })
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

    updateActionsSearchModel() {
      if (this.viewModel.stopReason) {
        if (this.viewModel.stopReason.searchOfPerson) {
          this.isAnyActionsTakenDisabled1 = true
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(18) ===
            -1
          ) {
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

      if (
        !this.viewModel.actionsTaken.personSearchConsentGiven &&
        !this.viewModel.actionsTaken.propertySearchConsentGiven
      ) {
        this.viewModel.actionsTaken.basisForSearch = null
        this.viewModel.actionsTaken.basisForSearchExplanation = null
        this.viewModel.actionsTaken.basisForSearchPiiFound = false
      }
    },

    updateBasisForPropertySeizureModel() {
      if (
        this.viewModel.actionsTaken.basisForPropertySeizure.includes(2) ||
        this.viewModel.actionsTaken.basisForPropertySeizure.includes(3)
      ) {
        this.viewModel.actionsTaken.anyContraband = true
      }
    },

    clearContrabandOrEvidenceDiscoveredModel() {
      this.$nextTick(() => {
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = []
      })
    },

    clearPerceivedOrKnownDisabilityModel() {
      this.$nextTick(() => {
        this.viewModel.person.perceivedOrKnownDisability = []
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

    updateStopReasonModel() {
      if (!this.viewModel.person.isStudent) {
        if (
          this.viewModel.stopReason.reasonForStop === 7 ||
          this.viewModel.stopReason.reasonForStop === 8
        ) {
          this.viewModel.stopReason.reasonForStop = null
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
        this.viewModel.stopResult.actionsTakenDuringStop12 = false
        this.viewModel.stopResult.actionsTakenDuringStop13 = false
      }

      if (!this.viewModel.stopResult.anyActionsTaken) {
        this.viewModel.stopResult.actionsTakenDuringStop2 = false
        this.viewModel.stopResult.actionsTakenDuringStop3 = false
        this.viewModel.stopResult.actionsTakenDuringStop4 = false
        this.viewModel.stopResult.actionsTakenDuringStop5 = false
        this.viewModel.stopResult.actionsTakenDuringStop6 = false
        this.viewModel.stopResult.actionsTakenDuringStop7 = false
        this.viewModel.stopResult.actionsTakenDuringStop8 = false
        this.viewModel.stopResult.actionsTakenDuringStop9 = false
        this.viewModel.stopResult.actionsTakenDuringStop10 = false
        this.viewModel.stopResult.actionsTakenDuringStop12 = false
        this.viewModel.stopResult.actionsTakenDuringStop13 = false
      }
    },

    updateStopResultWarningCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop2) {
        this.viewModel.stopResult.warningCodes = null
      }
    },

    updateStopResultCitationCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop3) {
        this.viewModel.stopResult.citationCodes = null
      }
    },

    updateStopResultInfieldCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop4) {
        this.viewModel.stopResult.infieldCodes = null
      }
    },

    updateStopResultCustodiaArrestCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop6) {
        this.viewModel.stopResult.custodialArrestCodes = null
      }
    },

    clearDisabilityModel() {
      this.viewModel.person.anyDisabilities = false
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
