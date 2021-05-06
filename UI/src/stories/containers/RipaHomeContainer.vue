<template>
  <ripa-page-container :admin="admin">
    <v-divider></v-divider>
    <div class="tw-my-4">
      {{ fullStop }}
    </div>
    <v-divider></v-divider>
    <div class="tw-my-4">
      {{ stop }}
    </div>
    <v-divider></v-divider>

    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>

    <template v-if="isEditingForm">
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
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import { format } from 'date-fns'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'
import { sampleStop } from '../data/formStop'

export default {
  name: 'ripa-home-container',

  components: {
    RipaPageContainer,
    RipaFormTemplate,
    RipaIntroTemplate,
  },

  data() {
    return {
      isEditingForm: false,
      mappedFormBeats: [],
      mappedFormCountyCities: [],
      mappedFormNonCountyCities: [],
      mappedFormSchools: [],
      mappedFormStatutes: [],
      stop: this.getDefaultStop(),
      fullStop: {},
    }
  },

  methods: {
    getOfficerYearsExperience() {
      return 20
    },

    getOfficerAssignment() {
      return 1
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

    getFormData() {
      this.loading = true
      setTimeout(() => {
        this.mappedFormSchools = formSchools()
        this.mappedFormBeats = formBeats()
        this.mappedFormCountyCities = formCountyCities()
        this.mappedFormNonCountyCities = formNonCountyCities()
        this.mappedFormStatutes = formStatutes()
        this.loading = false
      }, 500)
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

    validateReasonForStopForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        let isFound = false
        isFound = textValue.contains('Steve Pietrek')
        this.stop = Object.assign({}, this.stop)
        this.stop.updated = new Date()
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
      }
      this.updateFullStop()
    },

    validateBasisForSearchForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        let isFound = false
        isFound = textValue.contains('Steve Pietrek')
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

  created() {
    this.getFormData()
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
