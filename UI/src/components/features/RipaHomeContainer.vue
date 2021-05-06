<template>
  <div class="ripa-form-container">
    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>
    <template v-if="isEditingForm">
      <v-divider></v-divider>
      <div class="tw-my-4">
        {{ fullStop }}
      </div>
      <v-divider></v-divider>
      <div class="tw-my-4">
        {{ stop }}
      </div>
      <v-divider></v-divider>

      <ripa-form-template
        v-model="stop"
        :beats="mappedFormBeats"
        :county-cities="mappedFormCountyCities"
        :non-county-cities="mappedFormNonCountyCities"
        :schools="mappedFormSchools"
        :statutes="mappedFormStatutes"
        :on-add-person="handleAddPerson"
        :on-delete-person="handleDeletePerson"
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
import { sampleStop } from '@/stories/data/formStop'

export default {
  name: 'ripa-home-container',

  components: {
    RipaFormTemplate,
    RipaIntroTemplate,
  },

  data() {
    return {
      isEditingForm: false,
      stop: this.getDefaultStop(),
      fullStop: {},
    }
  },

  computed: {
    ...mapGetters([
      'isOnline',
      'isAuthenticated',
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
    ]),
  },

  methods: {
    ...mapActions(['checkTextForPii']),

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
      this.updateFullStop()
    },

    handleAddPerson() {
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.person = {
        id: 2,
        isStudent: false,
        perceivedRace: null,
        perceivedGender: null,
        perceivedLgbt: false,
        perceivedAge: null,
        anyDisabilities: false,
        perceivedOrKnownDisability: null,
      }
      this.updateFullStop()
    },

    handleDeletePerson(id) {
      const filteredPeople = this.fullStop.people.filter(item => item.id !== id)
      const updatedFullStop = {
        ...this.fullStop,
        people: filteredPeople,
      }
      this.fullStop = Object.assign({}, updatedFullStop)
    },

    handleTemplate(value) {
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
          person: {
            id: 1,
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
          person: {
            id: 1,
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

      if (value === 'test') {
        this.stop = sampleStop
      }

      this.updateFullStop()
    },

    updateFullStop() {
      const updatedPerson = {
        ...this.stop.person,
        id: this.stop.person.id,
        actionsTaken: this.stop.actionsTaken,
        stopReason: this.stop.stopReason,
        stopResult: this.stop.stopResult,
      }

      const updatedFullStop = Object.assign({}, this.fullStop)
      updatedFullStop.updated = new Date()
      updatedFullStop.officer = this.stop.officer
      updatedFullStop.stopDate = this.stop.stopDate
      updatedFullStop.location = this.stop.location
      const personId = this.stop.person.id
      const people = updatedFullStop.people || []
      updatedFullStop.people = people.filter(item => item.id !== personId)
      updatedFullStop.people.push(updatedPerson)
      this.fullStop = Object.assign({}, updatedFullStop)
    },

    getDefaultStop() {
      return {
        person: {
          id: 1,
        },
      }
    },

    handleCancel() {
      this.isEditingForm = false
      this.stop = this.getDefaultStop()
      this.updateFullStop()
    },

    async validateReasonForStopForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.updated = new Date()
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
      }
      this.updateFullStop()
    },

    async validateBasisForSearchForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.updated = new Date()
        if (this.stop.actionsTaken) {
          this.stop.actionsTaken.basisForSearchPiiFound = isFound
        }
      }
      this.updateFullStop()
    },
  },

  watch: {
    'stop.stopReason.reasonForStopExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateReasonForStopForPii(newVal)
        }
      },
    },
    'stop.actionsTaken.basisForSearchExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateBasisForSearchForPii(newVal)
        }
      },
    },
  },
}
</script>
