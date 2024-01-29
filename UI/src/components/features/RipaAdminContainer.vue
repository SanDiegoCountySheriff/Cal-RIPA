<template>
  <div>
    <ripa-admin-template
      :loading="loading"
      :user="mappedUser"
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
      :on-edit-beat="handleEditBeat"
      :on-edit-user="handleEditUser"
      :on-upload-users="handleUploadUsers"
      :on-upload-domain="handleUploadDomain"
      :on-tab-change="handleTabChange"
      :savedFilters="stopQueryData"
      :historicalCpraReports="mappedAdminHistoricalCpraReports"
      :cpraReportStats="mappedAdminCpraReportStats"
      @handleCallErrorCodeSearch="handleCallErrorCodeSearch"
      @handleRedoItemsPerPage="handleRedoItemsPerPage"
      @handlePaginate="handlePaginate"
      @handleAdminFiltering="handleAdminFiltering"
      @handleUpdateSavedFilter="handleUpdateSavedFilter"
      @handleSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
      @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
      @handleSubmitStops="handleSubmitStops"
      @handleSubmitAll="handleSubmitAll"
      @handle-create-cpra-report="handleCreateCpraReport"
      @handle-download-cpra-report="handleDownloadCpraReport"
      @handle-remove-officer-gender="handleRemoveOfficerGender"
    ></ripa-admin-template>

    <ripa-snackbar :text="snackbarText" v-model="snackbarVisible">
    </ripa-snackbar>
  </div>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaAdminTemplate,
    RipaSnackbar,
  },

  data() {
    return {
      loading: false,
      snackbarText: null,
      snackbarVisible: false,
    }
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
      'mappedAdminCpraReportStats',
      'mappedAdminHistoricalCpraReports',
      'mappedUser',
      'stopQueryData',
      'resetPagination',
    ]),
  },

  methods: {
    ...mapActions([
      'deleteBeat',
      'editBeat',
      'editUser',
      'uploadUsers',
      'uploadDomain',
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
      'createCpraReport',
      'downloadCpraReport',
      'getHistoricalCpraReports',
      'setStopQueryData',
      'setResetPagination',
      'removeOfficerGender',
    ]),

    async handleRemoveOfficerGender() {
      this.loading = true
      this.removeOfficerGender()
      this.loading = false
    },

    async handleCallErrorCodeSearch(val) {
      this.getErrorCodes(val)
    },

    async handleTabChange(tabIndex) {
      this.loading = true
      if (
        tabIndex === '/admin/submissions' &&
        !this.$route.params.submissionId
      ) {
        if (!this.mappedAdminSubmissions.submissions) {
          let queryData = null
          if (this.stopQueryData?.filters) {
            queryData = {
              filters: {
                submissionFromDate: this.stopQueryData.filters.stopFromDate,
                submissionToDate: this.stopQueryData.filters.stopToDate,
              },
            }
          }
          await this.getAdminSubmissions(queryData)
        }
      }
      if (
        tabIndex === '/admin/submissions' &&
        this.$route.params.submissionId
      ) {
        await this.getAdminSubmission({ id: this.$route.params.submissionId })
      }
      if (tabIndex === '/admin/users') {
        await this.getAdminUsers()
      }
      if (tabIndex === '/admin/domains') {
        if (this.displayBeatInput) {
          await Promise.all([
            this.getAdminBeats(),
            this.getAdminCities(),
            this.getAdminSchools(),
            this.getAdminStatutes(),
          ])
        } else {
          await Promise.all([
            this.getAdminCities(),
            this.getAdminSchools(),
            this.getAdminStatutes(),
          ])
        }
      }
      if (tabIndex === '/admin/cpra') {
        await this.getHistoricalCpraReports()
      }

      this.loading = false
    },

    handleUpdateSavedFilter(val) {
      let updatedFilters
      const savedStopFilters = this.stopQueryData?.filters ?? null
      if (savedStopFilters) {
        updatedFilters = {
          filters: { ...savedStopFilters, ...val },
        }
      } else {
        updatedFilters = { filters: val }
      }
      this.setStopQueryData(updatedFilters)
    },

    async handleRedoItemsPerPage(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        this.setStopQueryData(pageData)
        await this.getAdminStops(pageData.version)
        this.loading = false
      } else if (pageData.type === 'submission') {
        await this.getAdminSubmissions(pageData)
        this.loading = false
      }
    },

    async handleSubmissionDetailItemsPerPage(pageData) {
      this.loading = true
      await this.getAdminSubmission({
        id: pageData.id,
        ...pageData,
      })
      this.loading = false
    },

    async handleSubmissionDetailPaginate(pageData) {
      this.loading = true
      await this.getAdminSubmission({
        id: pageData.submissionId,
        ...pageData,
      })
      this.loading = false
    },

    async handlePaginate(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        this.setStopQueryData(pageData)
        await this.getAdminStops(pageData.version)
      } else if (pageData.type === 'submission') {
        await this.getAdminSubmissions(pageData)
      }
      this.loading = false
    },

    async handleAdminFiltering(filterData) {
      this.loading = true
      if (filterData.type === 'stops') {
        if (this.resetPagination) {
          filterData.offset = 0
        }
        this.setStopQueryData(filterData)
        await this.getAdminStops(filterData.version)
        this.loading = false
        this.setResetPagination(true)
      } else if (filterData.type === 'submission') {
        await this.getAdminSubmissions(filterData)
        this.loading = false
      }
    },

    async handleDeleteBeat(beat) {
      this.loading = true
      await this.deleteBeat(beat)
      this.loading = false
    },

    async handleEditBeat(beat) {
      this.loading = true
      await this.editBeat(beat)
      this.loading = false
    },

    async handleEditUser(user) {
      this.loading = true
      await this.editUser(user)
      this.loading = false
    },

    async handleUploadUsers(usersFile, usersAgency) {
      this.loading = true
      const result = await this.uploadUsers({ usersFile, usersAgency })
      this.loading = false
      this.snackbarText = result
      this.snackbarVisible = true
    },

    async handleUploadDomain(domainFile) {
      this.loading = true
      const result = await this.uploadDomain(domainFile)
      this.loading = false
      this.snackbarText = result
      this.snackbarVisible = true
    },

    async handleCreateCpraReport(reportParameters) {
      this.loading = true
      const result = await this.createCpraReport(reportParameters)
      this.loading = false
      this.snackbarText = result
      this.snackbarVisible = true
    },

    async handleDownloadCpraReport(fileName) {
      this.loading = true
      const result = await this.downloadCpraReport(fileName)
      this.loading = false
      this.snackbarText = result
      this.snackbarVisible = true
    },

    async handleSubmitStops(stops) {
      this.loading = true
      const submissionResults = await this.submitStops(stops)
      if (!submissionResults.submissionId) {
        // show the error message, no redirect
        this.snackbarText = `Submission error: ${submissionResults}`
        this.snackbarVisible = true
      } else {
        // if the submission goes through (meaning no message was sent back),
        // set the toast text and automatically redirect
        const notificationText =
          stops.length > 1
            ? `${stops.length} stops were submitted`
            : '1 stop was submitted'
        this.snackbarText = notificationText
        this.snackbarVisible = true
        setTimeout(() => {
          // need to push user to submission screen
          this.$router.push(
            `/admin/submissions/${submissionResults.submissionId}`,
          )
        }, 4000)
      }
      this.loading = false
    },

    async handleSubmitAll(filterData) {
      this.loading = true
      const submissionResults = await this.submitAllStops(filterData)
      if (!submissionResults.submissionId) {
        this.snackbarText = `Submission error: ${submissionResults}`
        this.snackbarVisible = true
      } else {
        this.snackbarText = 'All stops were submitted'
        this.snackbarVisible = true
        // need to push user to submission screen
        setTimeout(() => {
          // need to push user to submission screen
          this.$router.push(
            `/admin/submissions/${submissionResults.submissionId}`,
          )
        }, 4000)
      }
      this.loading = false
    },
  },
}
</script>
