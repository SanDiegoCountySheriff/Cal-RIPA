<template>
  <ripa-page-container :admin="admin">
    <ripa-admin-template
      :loading="loading"
      :beats="mappedAdminBeats"
      :cities="mappedAdminCities"
      :schools="mappedAdminSchools"
      :statutes="mappedAdminStatutes"
      :stops="mappedAdminStops"
      :submissions="submissions"
    ></ripa-admin-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { statutes } from '../data/statutes'
import { stops } from '../data/stops'
import { submissions } from '../data/submissions'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaPageContainer,
    RipaAdminTemplate,
  },

  data() {
    return {
      loading: false,
      mappedAdminBeats: [],
      mappedAdminCities: [],
      mappedAdminSchools: [],
      mappedAdminStatutes: [],
      mappedAdminStops: [],
      mappedAdminSubmissions: [],
    }
  },

  methods: {
    getAdminData() {
      this.loading = true
      setTimeout(() => {
        this.mappedAdminBeats = beats
        this.mappedAdminCities = cities
        this.mappedAdminSchools = schools
        this.mappedAdminStatutes = statutes
        this.mappedAdminStops = stops
        this.mappedAdminSubmissions = submissions
        this.loading = false
      }, 2500)
    },
  },

  created() {
    this.getAdminData()
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
