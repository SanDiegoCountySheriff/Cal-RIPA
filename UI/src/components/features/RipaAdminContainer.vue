<template>
  <ripa-admin-template
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="statutes"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaAdminTemplate,
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState(['beats', 'cities', 'schools', 'statutes']),
  },

  methods: {
    ...mapActions(['getBeats', 'getCities', 'getSchools', 'getStatutes']),

    async getAdminData() {
      this.loading = true
      await Promise.all([
        this.getBeats(),
        this.getCities(),
        this.getSchools(),
        this.getStatutes(),
      ])
      this.loading = false
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
