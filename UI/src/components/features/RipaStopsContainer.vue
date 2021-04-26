<template>
  <ripa-stops-template :items="stops"></ripa-stops-template>
</template>

<script>
import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaStopsTemplate,
  },

  data() {
    return {
      items: [],
    }
  },

  computed: {
    ...mapState(['stops']),
  },

  methods: {
    ...mapActions(['getStops']),

    async getStopsData() {
      this.loading = true
      await Promise.all([this.getStops()])
      this.loading = false
    },
  },

  created() {
    this.getStopsData()
  },
}
</script>
