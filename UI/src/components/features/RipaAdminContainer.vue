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
    :display-beat-input="displayBeatInput"
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
    @handleRedoItemsPerPage="handleRedoItemsPerPage"
    @handlePaginate="handlePaginate"
    @handleAdminFiltering="handleAdminFiltering"
    @handleSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
    @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
    @handleSubmitStops="handleSubmitStops"
    @handleSubmitAll="handleSubmitAll"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { mapGetters, mapActions } from 'vuex'

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
      'displayBeatInput',
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
      'submitStops',
      'submitAllStops',
    ]),

    async handleCallErrorCodeSearch(val) {
      this.getErrorCodes(val)
    },

    async handleTabChange(tabIndex) {
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
          this.getAdminSubmission({ id: this.$route.params.submissionId }),
        ])
      }
      if (tabIndex === '/admin/stops') {
        await Promise.all([this.getAdminStops()])
      }
      if (tabIndex === '/admin/users') {
        await Promise.all([this.getAdminUsers()])
      }
      if (tabIndex === '/admin/domains') {
        if (this.displayBeatInput) {
          await Promise.all([this.getAdminBeats()])
        }
        await Promise.all([
          this.getAdminCities(),
          this.getAdminSchools(),
          this.getAdminStatutes(),
        ])
      }
      this.loading = false
    },

    async handleRedoItemsPerPage(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        await Promise.all([this.getAdminStops(pageData)])
        this.loading = false
      } else if (pageData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(pageData)])
        this.loading = false
      }
    },

    async handleSubmissionDetailItemsPerPage(pageData) {
      this.loading = true
      await Promise.all([
        this.getAdminSubmission({
          id: pageData.id,
          ...pageData,
        }),
      ])
      this.loading = false
    },

    async handleSubmissionDetailPaginate(pageData) {
      this.loading = true
      await Promise.all([
        this.getAdminSubmission({
          id: pageData.submissionId,
          ...pageData,
        }),
      ])
    },

    async handlePaginate(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        await Promise.all([this.getAdminStops(pageData)])
      } else if (pageData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(pageData)])
      }
      this.loading = false
    },

    async handleAdminFiltering(filterData) {
      this.loading = true
      if (filterData.type === 'stops') {
        await Promise.all([this.getAdminStops(filterData)])
        this.loading = false
      } else if (filterData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(filterData)])
        this.loading = false
      }
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

    async handleSubmitStops(stops) {
      this.loading = true
      const submissionResults = await Promise.all([this.submitStops(stops)])
      this.loading = false
      // need to push user to submission screen
      this.$router.push(
        `/admin/submissions/${submissionResults[0].submissionId}`,
      )
    },

    async handleSubmitAll(stops) {
      this.loading = true
      const submissionResults = await Promise.all([this.submitAllStops()])
      this.loading = false
      // need to push user to submission screen
      this.$router.push(
        `/admin/submissions/${submissionResults[0].submissionId}`,
      )
    },
  },
}
</script>
