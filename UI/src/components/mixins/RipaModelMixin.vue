<script>
import { format } from 'date-fns'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      EDUCATION_SUSPENSION_CODE: 1,
      TRAFFIC_VIOLATION_REASON: 1,
      REASONABLE_SUSPICION_REASON: 2,
      PROBABLE_CAUSE_REASON: 3,
      PAROLE_REASON: 4,
      OUTSTANDING_WARRANT_REASON: 5,
      TRUANT_REASON: 6,
      CONSENSUAL_ENCOUNTER_REASON: 7,
      EDUCATION_VIOLATION_REASON: 8,
      STUDENT_VIOLATION_REASON: 9,
    }
  },

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

    syncModel(newValue) {
      const syncedModel = {
        id: newValue.id,
        template: newValue.template,
        editStopExplanation: newValue.editStopExplanation || null,
        overridePii: newValue.overridePii || false,
        piiEntities: newValue.piiEntities,
        stepTrace: newValue.stepTrace || [],
        stopType: newValue.stopType,
        actionsTaken: {
          anyNonForceActionsTaken:
            newValue.actionsTaken?.anyNonForceActionsTaken || false,
          anyForceActionsTaken:
            newValue.actionsTaken?.anyForceActionsTaken || false,
          nonForceActionsTakenDuringStop:
            newValue.actionsTaken?.nonForceActionsTakenDuringStop || [],
          forceActionsTakenDuringStop:
            newValue.actionsTaken?.forceActionsTakenDuringStop || [],
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
          beat: newValue.location?.beat
            ? newValue.location.beat.toString()
            : null,
          latitude: newValue.location?.latitude || null,
          longitude: newValue.location?.longitude || null,
        },
        person: {
          anyDisabilities: newValue.person?.anyDisabilities || false,
          id: newValue.person?.id,
          index: newValue.person?.index,
          isStudent: newValue.person?.isStudent || false,
          perceivedAge: newValue.person?.perceivedAge || null,
          perceivedGender: newValue.person?.perceivedGender || null,
          genderNonconforming: newValue.person?.genderNonconforming || null,
          perceivedUnhoused: newValue.person?.perceivedUnhoused || false,
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
          stopInResponseToCFS: newValue.stopDate?.stopInResponseToCFS || false,
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
          probableCause: newValue.stopReason?.probableCause || [],
          probableCauseCode: newValue.stopReason?.probableCauseCode || null,
          searchOfPerson: newValue.stopReason?.searchOfPerson || null,
          searchOfProperty: newValue.stopReason?.searchOfProperty || null,
          reasonForStopExplanation:
            newValue.stopReason?.reasonForStopExplanation || null,
          reasonForStopPiiFound:
            newValue.stopReason?.reasonForStopPiiFound || false,
        },
        stopResult: {
          anyResultsOfStop: newValue.stopResult?.anyResultsOfStop || false,
          resultsOfStop1: newValue.stopResult?.resultsOfStop1 || false,
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
          resultsOfStop14: newValue.stopResult?.resultsOfStop14 || false,
          verbalWarningCodes: newValue.stopResult?.verbalWarningCodes || [],
          writtenWarningCodes: newValue.stopResult?.writtenWarningCodes || [],
          warningCodes: newValue.stopResult?.warningCodes || [],
          citationCodes: newValue.stopResult?.citationCodes || [],
          infieldCodes: newValue.stopResult?.infieldCodes || [],
          custodialArrestCodes: newValue.stopResult?.custodialArrestCodes || [],
          pullFromReasonCode: newValue.stopResult?.pullFromReasonCode || false,
        },
        agencyQuestions: newValue.agencyQuestions || [],
      }

      return syncedModel
    },

    clearContrabandOrEvidenceDiscoveredModel() {
      this.$nextTick(() => {
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = []
      })
    },

    updateModel() {
      this.updateSchoolModel()
      this.updateStudentModel()
      this.updateMoreLocationOptionsModel()
      this.updatePerceivedDisabilityModel()
      this.updateNonForceActionsTakenModel()
      this.updateNonForceActionsTakenSearchModel()
      this.updateBasisForSearchModel()
      this.updateBasisForPropertySeizureModel()
      this.updateBlockNumberModel()
      this.updateFullAddressModel()
      this.updatePerceivedLgbtModel()
      this.updatePropertyWasSeizedModel()
      this.updateStopReasonSearchModel()
      this.updateStopReasonModel()
      this.updateStopResultModel()
    },

    updateMoreLocationOptionsModel() {
      if (!this.viewModel.location.toggleLocationOptions) {
        this.viewModel.location.highwayExit = null
        this.viewModel.location.landmark = null
      }
    },

    updateNonForceActionsTakenModel() {
      if (!this.viewModel.actionsTaken.anyNonForceActionsTaken) {
        this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = null
        this.viewModel.actionsTaken.propertyWasSeized = false
        this.viewModel.actionsTaken.personSearchConsentGiven = false
        this.viewModel.actionsTaken.propertySearchConsentGiven = false
        this.viewModel.actionsTaken.basisForSearch = null
        this.viewModel.actionsTaken.basisForSearchExplanation = null
        this.viewModel.actionsTaken.basisForSearchPiiFound = false
      }

      if (!this.viewModel.person.isStudent) {
        if (
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop !== null &&
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.length > 0
        ) {
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 17,
            )
        }
      }
    },

    updateNonForceActionsTakenSearchModel() {
      const actionsTaken =
        this.viewModel.actionsTaken?.nonForceActionsTakenDuringStop || []

      if (
        actionsTaken.includes(10) &&
        !this.viewModel.stopReason.searchOfPerson
      ) {
        this.setPersonSearchAutomaticallySelected(false)
      }

      if (
        actionsTaken.includes(12) &&
        !this.viewModel.stopReason.searchOfProperty
      ) {
        this.setPropertySearchAutomaticallySelected(false)
      }

      if (this.viewModel.stopReason.searchOfPerson) {
        this.isAnyNonForceActionsTakenDisabled1 = true
        this.viewModel.actionsTaken.anyNonForceActionsTaken = true
        if (!actionsTaken.includes(10)) {
          if (
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop === null
          ) {
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = []
          }
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.push(10)
          this.setPersonSearchAutomaticallySelected(true)
        }
      }
      if (this.viewModel.stopReason.searchOfProperty) {
        this.isAnyNonForceActionsTakenDisabled2 = true
        this.viewModel.actionsTaken.anyNonForceActionsTaken = true
        if (!actionsTaken.includes(12)) {
          if (
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop === null
          ) {
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = []
          }
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.push(12)
          this.setPropertySearchAutomaticallySelected(true)
        }
      }

      if (!actionsTaken.includes(8)) {
        this.viewModel.actionsTaken.personSearchConsentGiven = false
      }

      if (!actionsTaken.includes(11)) {
        this.viewModel.actionsTaken.propertySearchConsentGiven = false
      }

      if (!actionsTaken.includes(10) && !actionsTaken.includes(12)) {
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

      const actionsTaken =
        this.viewModel.actionsTaken?.nonForceActionsTakenDuringStop || []
      if (
        !actionsTaken.includes(12) &&
        this.viewModel.actionsTaken.basisForSearch !== null &&
        this.viewModel.actionsTaken.basisForSearch.length > 0
      ) {
        this.viewModel.actionsTaken.basisForSearch =
          this.viewModel.actionsTaken.basisForSearch.filter(item => item !== 12)
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

      if (!this.viewModel.person.isStudent) {
        if (
          this.viewModel.actionsTaken.basisForSearch !== null &&
          this.viewModel.actionsTaken.basisForSearch.length > 0
        ) {
          this.viewModel.actionsTaken.basisForSearch =
            this.viewModel.actionsTaken.basisForSearch.filter(
              item => item !== 13,
            )
        }
        if (
          this.viewModel.actionsTaken.basisForPropertySeizure !== null &&
          this.viewModel.actionsTaken.basisForPropertySeizure.length > 0
        ) {
          this.viewModel.actionsTaken.basisForPropertySeizure =
            this.viewModel.actionsTaken.basisForPropertySeizure.filter(
              item => item !== 6,
            )
        }
      }
    },

    parseBlockNumber(value) {
      let blockNumber = value
      if (blockNumber !== null && blockNumber.length > 0) {
        const calcBlockNumber = Math.floor(Number(blockNumber) / 100) * 100
        blockNumber = calcBlockNumber
      }

      const result =
        typeof blockNumber === 'string' ||
        (typeof blockNumber === 'number' && !isNaN(blockNumber))
          ? blockNumber.toString()
          : null

      return result
    },

    updateBlockNumberModel() {
      this.viewModel.location.blockNumber = this.parseBlockNumber(
        this.viewModel.location.blockNumber,
      )
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

    updatePerceivedLgbtModel() {
      if (
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4 ||
        this.viewModel.person.perceivedGender === 7 ||
        this.viewModel.person.perceivedGender === 8 ||
        this.viewModel.person.perceivedGender === 9
      ) {
        this.viewModel.person.perceivedLgbt = true
      }
    },

    updatePropertyWasSeizedModel() {
      const actionsTaken =
        this.viewModel.actionsTaken?.nonForceActionsTakenDuringStop || []

      if (!this.viewModel.actionsTaken.propertyWasSeized) {
        this.viewModel.actionsTaken.basisForPropertySeizure = null
        this.viewModel.actionsTaken.typeOfPropertySeized = null
        this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
          actionsTaken.filter(item => item !== 13)
      } else {
        if (!actionsTaken.includes(13)) {
          if (
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop === null
          ) {
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = []
          }
          this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.push(13)
        }
      }
    },

    updateSchoolModel() {
      if (!this.viewModel.location.isSchool) {
        this.viewModel.location.school = null
        this.viewModel.person.isStudent = false
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
      }
    },

    updateStudentModel() {
      if (!this.viewModel.person.isStudent) {
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
      }
    },

    updatePerceivedDisabilityModel() {
      if (!this.viewModel.person.isStudent) {
        const options = this.viewModel.person?.perceivedOrKnownDisability || []
        const studentOptionFound = options.includes(7)
        if (studentOptionFound) {
          this.viewModel.person.perceivedOrKnownDisability = options.filter(
            item => item !== 7,
          )
        }
      }

      if (!this.viewModel.person.anyDisabilities) {
        this.viewModel.person.perceivedOrKnownDisability = []
      }
    },

    removeActionsTakenPersonSearch() {
      this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
        this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.filter(
          item => item !== 10,
        )
    },

    removeActionsTakenPropertySearch() {
      this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
        this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.filter(
          item => item !== 12,
        )
    },

    updateStopReasonModel() {
      if (!this.viewModel.person.isStudent) {
        if (
          this.viewModel.stopReason.reasonForStop ===
            this.EDUCATION_VIOLATION_REASON ||
          this.viewModel.stopReason.reasonForStop ===
            this.STUDENT_VIOLATION_REASON
        ) {
          this.viewModel.stopReason.reasonForStop = null
          this.viewModel.stopReason.educationViolation = null
          this.viewModel.stopReason.educationViolationCode = null
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.TRAFFIC_VIOLATION_REASON
      ) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.reasonableSuspicion = []
        this.viewModel.stopReason.reasonableSuspicionCode = null
        this.viewModel.stopReason.probableCause = []
        this.viewModel.stopReason.probableCauseCode = null
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.REASONABLE_SUSPICION_REASON
      ) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
        this.viewModel.stopReason.probableCause = []
        this.viewModel.stopReason.probableCauseCode = null
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop === this.PROBABLE_CAUSE_REASON
      ) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
        this.viewModel.stopReason.reasonableSuspicion = []
        this.viewModel.stopReason.reasonableSuspicionCode = null
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.EDUCATION_VIOLATION_REASON
      ) {
        this.viewModel.stopReason.reasonableSuspicion = []
        this.viewModel.stopReason.reasonableSuspicionCode = null
        this.viewModel.stopReason.probableCause = []
        this.viewModel.stopReason.probableCauseCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.STUDENT_VIOLATION_REASON
      ) {
        if (
          this.viewModel.stopReason.educationViolation !==
          this.EDUCATION_SUSPENSION_CODE
        ) {
          this.viewModel.stopReason.educationViolationCode = null
        }
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop === this.PAROLE_REASON ||
        this.viewModel.stopReason.reasonForStop ===
          this.OUTSTANDING_WARRANT_REASON ||
        this.viewModel.stopReason.reasonForStop === this.TRUANT_REASON ||
        this.viewModel.stopReason.reasonForStop ===
          this.EDUCATION_VIOLATION_REASON
      ) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.reasonableSuspicion = []
        this.viewModel.stopReason.reasonableSuspicionCode = null
        this.viewModel.stopReason.probableCause = []
        this.viewModel.stopReason.probableCauseCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.removeActionsTakenPersonSearch()
        }
        if (this.propertySearchAutomaticallySelected) {
          this.removeActionsTakenPropertySearch()
        }
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.CONSENSUAL_ENCOUNTER_REASON
      ) {
        this.viewModel.stopReason.educationViolation = null
        this.viewModel.stopReason.educationViolationCode = null
        this.viewModel.stopReason.reasonableSuspicion = []
        this.viewModel.stopReason.reasonableSuspicionCode = null
        this.viewModel.stopReason.probableCause = []
        this.viewModel.stopReason.probableCauseCode = null
        this.viewModel.stopReason.trafficViolation = null
        this.viewModel.stopReason.trafficViolationCode = null
      }
    },

    updateStopReasonSearchModel() {
      if (
        this.viewModel.stopReason.reasonForStop !==
        this.CONSENSUAL_ENCOUNTER_REASON
      ) {
        this.viewModel.stopReason.searchOfPerson = false
        this.viewModel.stopReason.searchOfProperty = false
      }

      if (
        this.viewModel.stopReason.reasonForStop ===
        this.CONSENSUAL_ENCOUNTER_REASON
      ) {
        const actionsTaken =
          this.viewModel.actionsTaken?.nonForceActionsTakenDuringStop || []
        if (this.viewModel.stopReason.searchOfPerson) {
          this.viewModel.actionsTaken.anyNonForceActionsTaken = true
          if (!actionsTaken.includes(10)) {
            if (
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop ===
              null
            ) {
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.push(10)
          }
        } else {
          if (
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop !==
              null &&
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.length >
              0
          ) {
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.filter(
                item => item !== 10,
              )
          }
        }
        if (this.viewModel.stopReason.searchOfProperty) {
          this.viewModel.actionsTaken.anyNonForceActionsTaken = true
          if (!actionsTaken.includes(12)) {
            if (
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop ===
              null
            ) {
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop = []
            }
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.push(12)
          }
        } else {
          if (
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop !==
              null &&
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.length >
              0
          ) {
            this.viewModel.actionsTaken.nonForceActionsTakenDuringStop =
              this.viewModel.actionsTaken.nonForceActionsTakenDuringStop.filter(
                item => item !== 12,
              )
          }
        }
      }
    },

    updateStopResultModel() {
      if (!this.viewModel.stopResult.anyResultsOfStop) {
        this.viewModel.stopResult.resultsOfStop1 = false
        this.viewModel.stopResult.resultsOfStop2 = false
        this.viewModel.stopResult.resultsOfStop3 = false
        this.viewModel.stopResult.resultsOfStop4 = false
        this.viewModel.stopResult.resultsOfStop5 = false
        this.viewModel.stopResult.resultsOfStop6 = false
        this.viewModel.stopResult.resultsOfStop7 = false
        this.viewModel.stopResult.resultsOfStop8 = false
        this.viewModel.stopResult.resultsOfStop9 = false
        this.viewModel.stopResult.resultsOfStop10 = false
        this.viewModel.stopResult.resultsOfStop11 = false
        this.viewModel.stopResult.resultsOfStop12 = false
        this.viewModel.stopResult.resultsOfStop13 = false
        this.viewModel.stopResult.resultsOfStop14 = false
      }

      if (!this.viewModel.stopResult.resultsOfStop1) {
        this.viewModel.stopResult.verbalWarningCodes = null
      }

      if (!this.viewModel.stopResult.resultsOfStop2) {
        this.viewModel.stopResult.warningCodes = null
      }

      if (!this.viewModel.stopResult.resultsOfStop3) {
        this.viewModel.stopResult.citationCodes = null
      }

      if (!this.viewModel.stopResult.resultsOfStop4) {
        this.viewModel.stopResult.infieldCodes = null
      }

      if (!this.viewModel.stopResult.resultsOfStop6) {
        this.viewModel.stopResult.custodialArrestCodes = null
      }

      if (!this.viewModel.stopResult.resultsOfStop14) {
        this.viewModel.stopResult.writtenWarningCodes = null
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
