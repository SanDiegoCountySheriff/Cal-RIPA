<template>
  <ripa-page-container :admin="admin">
    <ripa-admin-template
      :loading="loading"
      :beats="mappedAdminBeats"
      :cities="mappedAdminCities"
      :schools="mappedAdminSchools"
      :statutes="mappedAdminStatutes"
      :stops="mappedAdminStops"
      :submissions="mappedAdminSubmissions"
      :users="mappedAdminUsers"
    ></ripa-admin-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import {
  adminBeats,
  adminCities,
  adminSchools,
  adminStatutes,
  adminUsers,
} from '../data/mappings'
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
      mappedAdminUsers: [],
    }
  },

  methods: {
    getAdminData() {
      this.loading = true
      setTimeout(() => {
        this.mappedAdminBeats = adminBeats()
        this.mappedAdminCities = adminCities()
        this.mappedAdminSchools = adminSchools()
        this.mappedAdminStatutes = adminStatutes()
        this.mappedAdminStops = stops
        this.mappedAdminSubmissions = submissions
        this.mappedAdminUsers = adminUsers()
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
