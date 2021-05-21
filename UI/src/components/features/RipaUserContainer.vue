<template>
  <ripa-user-template
    :stop="getStop"
    :on-update="handleUpdate"
  ></ripa-user-template>
</template>

<script>
import RipaUserTemplate from '@/components/templates/RipaUserTemplate'
import {
  getOfficerYearsExperience,
  getOfficerAssignment,
  getOfficerOtherType,
  setOfficer,
} from '@/utilities/officer'

export default {
  name: 'ripa-user-container',

  components: {
    RipaUserTemplate,
  },

  computed: {
    getStop() {
      return {
        officer: {
          yearsExperience: getOfficerYearsExperience(),
          assignment: getOfficerAssignment(),
          otherType: getOfficerOtherType(),
        },
      }
    },
  },

  methods: {
    setStop(stop) {
      setOfficer(stop.officer)
    },

    handleUpdate(stop) {
      this.setStop(stop)
    },
  },
}
</script>
