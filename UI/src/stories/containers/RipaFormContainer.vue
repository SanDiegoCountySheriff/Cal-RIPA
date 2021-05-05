<template>
  <ripa-page-container :admin="admin">
    {{ stop }}
    <ripa-form-template
      v-model="stop"
      :beats="mappedFormBeats"
      :county-cities="mappedFormCountyCities"
      :non-county-cities="mappedFormNonCountyCities"
      :schools="mappedFormSchools"
      :statutes="mappedFormStatutes"
      @input="handleInput"
    ></ripa-form-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import { format } from 'date-fns'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  name: 'ripa-form-container',

  components: {
    RipaPageContainer,
    RipaFormTemplate,
  },

  data() {
    return {
      mappedFormBeats: [],
      mappedFormCountyCities: [],
      mappedFormNonCountyCities: [],
      mappedFormSchools: [],
      mappedFormStatutes: [],
      // stop: {
      //   officer: {
      //     editOfficer: false,
      //     yearsExperience: this.getOfficerYearsExperience(),
      //     assignment: this.getOfficerAssignment(),
      //   },
      //   stopDate: {
      //     date: format(new Date(), 'yyyy-MM-dd'),
      //     time: format(new Date(), 'h:mm'),
      //   },
      //   stopReason: {
      //     reasonForStop: 1,
      //     trafficViolation: 1,
      //     trafficViolationCode: 54106,
      //     reasonForStopExplanation: 'Speeding',
      //   },
      // },
      stop: {
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
      },
    }
  },

  methods: {
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
      this.stop = newVal
      this.$forceUpdate()
    },

    getAdminData() {
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
  },

  created() {
    this.getAdminData()
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
