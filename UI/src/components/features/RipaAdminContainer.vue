<template>
  <ripa-admin-template
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :counties="counties"
    :schools="schools"
    :states="states"
    :statutes="statutes"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { STATES } from '@/constants/states'
import { COUNTIES } from '@/constants/counties'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaAdminTemplate,
  },

  data() {
    return {
      loading: false,
      beats: [],
      cities: [],
      counties: COUNTIES,
      schools: [],
      states: STATES,
      statutes: [],
    }
  },

  methods: {
    getAdminData() {
      this.loading = true
      setTimeout(() => {
        this.beats = []
        this.cities = []
        this.schools = []
        this.statutes = []
        this.loading = false
      }, 2500)
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
