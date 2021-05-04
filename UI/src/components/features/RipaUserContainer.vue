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
        yearsExperience: this.getOfficerYearsExperience(),
        assignment: this.getOfficerAssignment(),
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

    setOfficer(officer) {
      localStorage.setItem(
        'ripa_officer_years_experience',
        officer.yearsExperience,
      )
      localStorage.setItem('ripa_officer_assignment', officer.assignment)
    },

    handleUpdate(officer) {
      this.setOfficer(officer)
    },
  },
}
</script>
