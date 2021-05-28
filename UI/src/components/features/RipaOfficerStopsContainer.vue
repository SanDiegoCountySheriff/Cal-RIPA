<template>
  <ripa-officer-stops-template
    :items="officerStops"
    :loading="loading"
  ></ripa-officer-stops-template>
</template>

<script>
import RipaOfficerStopsTemplate from '@/components/templates/RipaOfficerStopsTemplate'
import { mapState, mapActions, mapGetters } from 'vuex'

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
    ...mapGetters(['officerId']),
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
    if (this.officerId) {
      this.getOfficerStopsData()
    }
  },

  watch: {
    officerId(val) {
      console.log('officer id loaded')
      if (val) {
        this.getOfficerStopsData()
      }
    },
  },
}
</script>
