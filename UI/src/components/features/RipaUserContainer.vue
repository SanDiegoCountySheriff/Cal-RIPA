<template>
  <ripa-user-template
    :officer="getOfficer"
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
    getOfficer() {
      return {
        years: this.getOfficerYearsExperience(),
        assignment: this.getOfficerAssignment(),
      }
    },
  },

  methods: {
    getOfficerYearsExperience() {
      const years = localStorage.getItem('ripa_officer_years_experience')
      return +years || null
    },

    getOfficerAssignment() {
      const assignment = localStorage.getItem('ripa_officer_assignment')
      return +assignment || null
    },

    setOfficer(officer) {
      localStorage.setItem('ripa_officer_years_experience', officer.years)
      localStorage.setItem('ripa_officer_assignment', officer.assignment)
    },

    handleUpdate(officer) {
      this.setOfficer(officer)
    },
  },
}
</script>
