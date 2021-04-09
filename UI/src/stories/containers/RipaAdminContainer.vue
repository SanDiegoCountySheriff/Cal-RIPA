<template>
  <ripa-page-container>
    <ripa-admin-template
      :loading="loading"
      :beats="beats"
      :cities="cities"
      :counties="counties"
      :schools="schools"
      :states="states"
      :statutes="statutes"
    ></ripa-admin-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { STATES } from '@/constants/states'
import { COUNTIES } from '@/constants/counties'
import { schools } from '../data/schools'
import { statutes } from '../data/statutes'

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
        this.beats = beats
        this.cities = cities
        this.schools = schools
        this.statutes = statutes
        this.loading = false
      }, 2500)
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
