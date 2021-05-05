<template>
  <ripa-page-container :admin="admin">
    {{ stop }}
    <ripa-form-template
      v-model="stop"
      :beats="mappedFormBeats"
      :cities="mappedFormCities"
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
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { offenseCodes } from '../data/offenseCodes'

export default {
  name: 'ripa-form-container',

  components: {
    RipaPageContainer,
    RipaFormTemplate,
  },

  data() {
    return {
      mappedFormBeats: [],
      mappedFormCities: [],
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
        this.mappedFormSchools = schools
          .sort((x, y) => {
            const schoolA = x.name.toUpperCase()
            const schoolB = y.name.toUpperCase()
            return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
          })
          .map(item => {
            return {
              ...item,
              fullName: `${item.name} (${item.district}) ${item.cdsCode}`,
            }
          })
        this.mappedFormBeats = beats
          .sort((x, y) => {
            const beatA = x.command.toUpperCase()
            const beatB = y.command.toUpperCase()
            return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
          })
          .map(item => {
            return {
              ...item,
              fullName: `${item.command} ${item.id}`,
            }
          })
        this.mappedFormCities = cities.sort((x, y) => {
          const cityA = x.name.toUpperCase()
          const cityB = y.name.toUpperCase()
          return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
        })
        this.mappedFormStatutes = offenseCodes.map(item => {
          return {
            ...item,
            fullName: `${item.description} ${item.code}`,
          }
        })
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
