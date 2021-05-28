<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <ripa-officer-stops-template
      :items="officerStops"
    ></ripa-officer-stops-template>
  </div>
</template>

<script>
import RipaOfficerStopsTemplate from '@/components/templates/RipaOfficerStopsTemplate'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'ripa-officer-stops-container',

  data() {
    return {
      loading: true,
    }
  },

  components: {
    RipaOfficerStopsTemplate,
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
