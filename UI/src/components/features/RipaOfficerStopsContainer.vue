<template>
  <ripa-officer-stops-template
    :items="officerStops"
    :loading="loading"
  ></ripa-officer-stops-template>
</template>

<script>
import RipaOfficerStopsTemplate from '@/components/templates/RipaOfficerStopsTemplate'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ripa-officer-stops-container',

  components: {
    RipaOfficerStopsTemplate,
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState(['officerStops']),
  },

  methods: {
    ...mapActions(['getOfficerStops']),

    async getOfficerStopsData() {
      this.loading = true
      await Promise.all([this.getOfficerStops()])
      this.loading = false
    },
  },

  created() {
    this.getOfficerStopsData()
  },
}
</script>
