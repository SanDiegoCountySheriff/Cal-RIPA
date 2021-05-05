<template>
  <ripa-user-template
    :stop="getStop"
    :on-update="handleUpdate"
  ></ripa-user-template>
</template>

<script>
import RipaUserTemplate from '@/components/templates/RipaUserTemplate'

export default {
  name: 'ripa-user-container',

  components: {
    RipaUserTemplate,
  },

  computed: {
    getStop() {
      return {
        officer: {
          yearsExperience: this.getOfficerYearsExperience(),
          assignment: this.getOfficerAssignment(),
        },
      }
    },
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

    setStop(stop) {
      localStorage.setItem(
        'ripa_officer_years_experience',
        stop.officer.yearsExperience,
      )
      localStorage.setItem('ripa_officer_assignment', stop.officer.assignment)
    },

    handleUpdate(stop) {
      this.setStop(stop)
    },
  },
}
</script>
