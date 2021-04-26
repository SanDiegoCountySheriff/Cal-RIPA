<template>
  <ripa-page-container :admin="admin">
    <ripa-admin-template
      :loading="loading"
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :statutes="statutes"
      :stops="stops"
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
      beats: [],
      cities: [],
      schools: [],
      statutes: [],
      stops: [],
      submissions: [],
    }
  },

  methods: {
    getAdminData() {
      this.loading = true
      setTimeout(() => {
        this.beats = beats
        this.cities = cities
        this.schools = schools
        this.statutes = statutes
        this.stops = stops
        this.submissions = submissions
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
