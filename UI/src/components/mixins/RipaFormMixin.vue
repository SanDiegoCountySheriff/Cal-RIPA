<script>
import { format } from 'date-fns'

export default {
  methods: {
    loadModel(newValue) {
      return {
        id: newValue.id,
        agency: newValue.agency,
        officerId: newValue.officerId,
        actionsTaken: {
          anyActionsTaken: newValue?.actionsTaken?.anyActionsTaken || false,
          actionsTakenDuringStop:
            newValue?.actionsTaken?.actionsTakenDuringStop || [],
          personSearchConsentGiven:
            newValue?.actionsTaken?.personSearchConsentGiven || false,
          propertySearchConsentGiven:
            newValue?.actionsTaken?.propertySearchConsentGiven || false,
          basisForSearch: newValue?.actionsTaken?.basisForSearch || [],
          basisForSearchExplanation:
            newValue?.actionsTaken?.basisForSearchExplanation || null,
          basisForSearchPiiFound:
            newValue?.actionsTaken?.basisForSearchPiiFound || false,
          propertyWasSeized: newValue?.actionsTaken?.propertyWasSeized || false,
          basisForPropertySeizure:
            newValue?.actionsTaken?.basisForPropertySeizure || [],
          typeOfPropertySeized:
            newValue?.actionsTaken?.typeOfPropertySeized || [],
          anyContraband: newValue?.actionsTaken?.anyContraband || false,
          contrabandOrEvidenceDiscovered:
            newValue?.actionsTaken?.contrabandOrEvidenceDiscovered || [],
        },
        location: {
          isSchool: newValue?.location?.isSchool || false,
          school: newValue?.location?.school || null,
          blockNumber: newValue?.location?.blockNumber || null,
          streetName: newValue?.location?.streetName || null,
          intersection: newValue?.location?.intersection || null,
          moreLocationOptions: newValue?.location?.moreLocationOptions || false,
          highwayExit: newValue?.location?.highwayExit || null,
          landmark: newValue?.location?.landmark || null,
          outOfCounty: newValue?.location?.outOfCounty || false,
          city: newValue?.location?.city || null,
          beat: newValue?.location?.beat || null,
        },
        officer: {
          editOfficer: newValue?.officer?.editOfficer || null,
          yearsExperience: newValue?.officer?.yearsExperience || null,
          assignment: newValue?.officer?.assignment || null,
          otherType: newValue?.officer?.otherType || null,
        },
        person: {
          anyDisabilities: newValue?.person?.anyDisabilities || false,
          id: newValue?.person?.id,
          isStudent: newValue?.person?.isStudent || false,
          perceivedAge: newValue?.person?.perceivedAge || null,
          perceivedGender: newValue?.person?.perceivedGender || null,
          genderNonconforming: newValue?.person?.genderNonconforming || false,
          perceivedLimitedEnglish:
            newValue?.person?.perceivedLimitedEnglish || false,
          perceivedLgbt: newValue?.person?.perceivedLgbt || false,
          perceivedOrKnownDisability:
            newValue?.person?.perceivedOrKnownDisability || [],
          perceivedRace: newValue?.person?.perceivedRace || [],
        },
        stopDate: {
          date: newValue?.stopDate?.date || format(new Date(), 'yyyy-MM-dd'),
          time: newValue?.stopDate?.time || format(new Date(), 'k:mm'),
          duration: newValue?.stopDate?.duration || null,
          stopInResponseToCfs: newValue?.stopDate?.stopInResponseToCfs || false,
        },
        stopReason: {
          reasonForStop: newValue?.stopReason?.reasonForStop || null,
          educationViolation: newValue?.stopReason?.educationViolation || null,
          educationViolationCode:
            newValue?.stopReason?.educationViolationCode || null,
          trafficViolation: newValue?.stopReason?.trafficViolation || null,
          trafficViolationCode:
            newValue?.stopReason?.trafficViolationCode || null,
          reasonableSuspicion: newValue?.stopReason?.reasonableSuspicion || [],
          reasonableSuspicionCode:
            newValue?.stopReason?.reasonableSuspicionCode || null,
          searchOfPerson: newValue?.stopReason?.searchOfPerson || null,
          searchOfProperty: newValue?.stopReason?.searchOfProperty || null,
          reasonForStopExplanation:
            newValue?.stopReason?.reasonForStopExplanation || null,
          reasonForStopPiiFound:
            newValue?.stopReason?.reasonForStopPiiFound || false,
        },
        stopResult: {
          anyActionsTaken: newValue?.stopResult?.anyActionsTaken || false,
          actionsTakenDuringStop1:
            newValue?.stopResult?.actionsTakenDuringStop1 || false,
          actionsTakenDuringStop2:
            newValue?.stopResult?.actionsTakenDuringStop2 || false,
          actionsTakenDuringStop3:
            newValue?.stopResult?.actionsTakenDuringStop3 || false,
          actionsTakenDuringStop4:
            newValue?.stopResult?.actionsTakenDuringStop4 || false,
          actionsTakenDuringStop5:
            newValue?.stopResult?.actionsTakenDuringStop5 || false,
          actionsTakenDuringStop6:
            newValue?.stopResult?.actionsTakenDuringStop6 || false,
          actionsTakenDuringStop7:
            newValue?.stopResult?.actionsTakenDuringStop7 || false,
          actionsTakenDuringStop8:
            newValue?.stopResult?.actionsTakenDuringStop8 || false,
          actionsTakenDuringStop9:
            newValue?.stopResult?.actionsTakenDuringStop9 || false,
          actionsTakenDuringStop10:
            newValue?.stopResult?.actionsTakenDuringStop10 || false,
          actionsTakenDuringStop12:
            newValue?.stopResult?.actionsTakenDuringStop12 || false,
          actionsTakenDuringStop13:
            newValue?.stopResult?.actionsTakenDuringStop13 || false,
          warningCodes: newValue?.stopResult?.warningCodes || [],
          citationCodes: newValue?.stopResult?.citationCodes || [],
          infieldCodes: newValue?.stopResult?.infieldCodes || [],
          custodialArrestCodes:
            newValue?.stopResult?.custodialArrestCodes || [],
        },
      }
    },
  },
}
</script>
