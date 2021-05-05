<template>
  <div class="ripa-form-container">
    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>
    <template v-if="isEditingForm">
      {{ stop }}
      <ripa-form-template
        v-model="stop"
        :beats="mappedFormBeats"
        :county-cities="mappedFormCountyCities"
        :non-county-cities="mappedFormNonCountyCities"
        :schools="mappedFormSchools"
        :statutes="mappedFormStatutes"
        :on-cancel="handleCancel"
        @input="handleInput"
      ></ripa-form-template>
    </template>
  </div>
</template>

<script>
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import { mapGetters, mapActions } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'ripa-home-container',

  components: {
    RipaFormTemplate,
    RipaIntroTemplate,
  },

  data() {
    return {
      isEditingForm: false,
      stop: {},
    }
  },

  computed: {
    ...mapGetters([
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
    ]),
  },

  methods: {
    ...mapActions(['validateTextForPii']),

    getOfficerYearsExperience() {
      const yearsExperience = localStorage.getItem(
        'ripa_officer_years_experience',
      )
      return +yearsExperience || null
    },

    getOfficerAssignment() {
      const assignment = localStorage.getItem('ripa_officer_assignment')
      return +assignment || null
    },

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.stop.updated = new Date()
    },

    async handleTemplate(value) {
      this.isEditingForm = true

      if (value === 'motor') {
        this.stop = {
          officer: {
            editOfficer: false,
            yearsExperience: this.getOfficerYearsExperience(),
            assignment: this.getOfficerAssignment(),
          },
          stopDate: {
            date: format(new Date(), 'yyyy-MM-dd'),
            time: format(new Date(), 'h:mm'),
          },
          stopReason: {
            reasonForStop: 1,
            trafficViolation: 1,
            trafficViolationCode: 54106,
            reasonForStopExplanation: 'Speeding',
          },
        }
      }

      if (value === 'probation') {
        this.stop = {
          officer: {
            editOfficer: false,
            yearsExperience: this.getOfficerYearsExperience(),
            assignment: this.getOfficerAssignment(),
          },
          stopDate: {
            date: format(new Date(), 'yyyy-MM-dd'),
            time: format(new Date(), 'h:mm'),
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
    },

    handleCancel() {
      this.isEditingForm = false
      this.stop = {}
    },

    async validateReasonForStopExplanationForPii(textValue) {
      let isFound = false
      if (textValue === '') {
        isFound = await this.validateTextForPii(textValue)
      }
      const updatedStop = this.stop
      updatedStop.updated = new Date()
      updatedStop.stopReason.reasonForStopPiiFound = isFound
      this.stop = Object.assign({}, updatedStop)
    },

    async validateBasisForSearchExplanationForPii(textValue) {
      let isFound = false
      if (textValue === '') {
        isFound = await this.validateTextForPii(textValue)
      }
      const updatedStop = this.stop
      updatedStop.updated = new Date()
      updatedStop.actionsTaken.basisForSearchPiiFound = isFound
      this.stop = Object.assign({}, updatedStop)
    },
  },

  watch: {
    'stop.stopReason.reasonForStopExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateReasonForStopExplanationForPii(newVal)
        }
      },
    },
    'stop.actionsTaken.basisForSearchExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateBasisForSearchExplanationForPii(newVal)
        }
      },
    },
  },
}
</script>
