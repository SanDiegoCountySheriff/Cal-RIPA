<template>
  <ripa-admin-template
    :loading="loading"
    :beats="mappedAdminBeats"
    :cities="mappedAdminCities"
    :schools="mappedAdminSchools"
    :statutes="mappedAdminStatutes"
    :stops="mappedAdminStops"
    :submissions="mappedAdminSubmissions"
    :currentSubmission="mappedAdminSubmission"
    :users="mappedAdminUsers"
    :errorCodeSearch="mappedErrorCodeAdminSearch"
    :on-delete-beat="handleDeleteBeat"
    :on-delete-city="handleDeleteCity"
    :on-delete-school="handleDeleteSchool"
    :on-delete-statute="handleDeleteStatute"
    :on-edit-beat="handleEditBeat"
    :on-edit-city="handleEditCity"
    :on-edit-school="handleEditSchool"
    :on-edit-statute="handleEditStatute"
    :on-edit-user="handleEditUser"
    :on-tab-change="handleTabChange"
    @handleCallErrorCodeSearch="handleCallErrorCodeSearch"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { mapGetters, mapActions, mapState } from 'vuex'

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

  watch: {
    '$route.params': {
      handler: function (params) {
        if (params.submissionId) {
          console.log('new route with submission id')
          this.handleTabChange('/admin/submissions')
        }
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {
    ...mapGetters([
      'mappedAdminBeats',
      'mappedAdminCities',
      'mappedAdminSchools',
      'mappedAdminStatutes',
      'mappedAdminStops',
      'mappedAdminSubmissions',
      'mappedAdminSubmission',
      'mappedAdminUsers',
      'mappedErrorCodeAdminSearch',
    ]),
  },

  methods: {
    ...mapActions([
      'deleteBeat',
      'deleteCity',
      'deleteSchool',
      'deleteStatute',
      'editBeat',
      'editCity',
      'editSchool',
      'editStatute',
      'editUser',
      'getAdminBeats',
      'getAdminCities',
      'getAdminSchools',
      'getAdminStatutes',
      'getAdminStops',
      'getAdminUsers',
      'getAdminSubmissions',
      'getAdminSubmission',
      'getErrorCodes',
    ]),

    async handleCallErrorCodeSearch(val) {
      this.getErrorCodes(val)
    },

    async handleTabChange(tabIndex) {
      console.log(tabIndex)
      this.loading = true
      if (
        tabIndex === '/admin/submissions' &&
        !this.$route.params.submissionId
      ) {
        await Promise.all([this.getAdminSubmissions()])
      }
      if (
        tabIndex === '/admin/submissions' &&
        this.$route.params.submissionId
      ) {
        await Promise.all([
          this.getAdminSubmission(this.$route.params.submissionId),
        ])
      }
      if (tabIndex === '/admin/stops') {
        await Promise.all([this.getAdminStops()])
      }
      if (tabIndex === '/admin/users') {
        await Promise.all([this.getAdminUsers()])
      }
      if (tabIndex === '/admin/domains') {
        await Promise.all([
          this.getAdminBeats(),
          this.getAdminCities(),
          this.getAdminSchools(),
          this.getAdminStatutes(),
        ])
      }
      this.loading = false
    },

    async handleDeleteBeat(beat) {
      this.loading = true
      await Promise.all([this.deleteBeat(beat)])
      this.loading = false
    },

    async handleDeleteCity(city) {
      this.loading = true
      await Promise.all([this.deleteCity(city)])
      this.loading = false
    },

    async handleDeleteSchool(school) {
      this.loading = true
      await Promise.all([this.deleteSchool(school)])
      this.loading = false
    },

    async handleDeleteStatute(statute) {
      this.loading = true
      await Promise.all([this.deleteStatute(statute)])
      this.loading = false
    },

    async handleEditBeat(beat) {
      this.loading = true
      await Promise.all([this.editBeat(beat)])
      this.loading = false
    },

    async handleEditCity(city) {
      this.loading = true
      await Promise.all([this.editCity(city)])
      this.loading = false
    },

    async handleEditSchool(school) {
      this.loading = true
      await Promise.all([this.editSchool(school)])
      this.loading = false
    },

    async handleEditStatute(statute) {
      this.loading = true
      await Promise.all([this.editStatute(statute)])
      this.loading = false
    },

    async handleEditUser(user) {
      this.loading = true
      await Promise.all([this.editUser(user)])
      this.loading = false
    },
  },
}
</script>
