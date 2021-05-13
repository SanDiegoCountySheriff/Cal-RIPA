<template>
  <ripa-page-container :admin="admin">
    <ripa-user-template
      :stop="getStop"
      :on-update="handleUpdate"
    ></ripa-user-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
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
    RipaPageContainer,
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

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
