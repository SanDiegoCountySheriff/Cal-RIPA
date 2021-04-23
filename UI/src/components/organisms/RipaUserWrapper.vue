<template>
  <v-card class="mx-auto my-12" max-width="600">
    <ripa-officer :value="officer"></ripa-officer>
  </v-card>
</template>

<script>
import RipaOfficer from '@/components/molecules/RipaOfficer'

export default {
  name: 'ripa-user-wrapper',

  components: {
    RipaOfficer,
  },

  data() {
    return {
      officer: {
        years: 25,
        assignment: 1,
      },
    }
  },
}
</script>
