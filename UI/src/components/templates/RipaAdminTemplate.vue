<template>
  <div>
    <ripa-admin-wrapper
      :loading="loading"
      :user="user"
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :statutes="statutes"
      :stops="stops"
      :pii-entities="piiEntities"
      :submissions="submissions"
      :currentSubmission="currentSubmission"
      :users="users"
      :errorCodeSearch="errorCodeSearch"
      :display-beat-input="displayBeatInput"
      :on-delete-beat="onDeleteBeat"
      :on-edit-beat="onEditBeat"
      :on-edit-user="onEditUser"
      :on-upload-users="onUploadUsers"
      :on-upload-domain="onUploadDomain"
      :on-tab-change="onTabChange"
      :savedFilters="savedFilters"
      :historicalCpraReports="historicalCpraReports"
      :cpraReportStats="cpraReportStats"
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
      @handle-get-pii-entities="handleGetPiiEntities"
      @handle-mark-false-positive="handleMarkFalsePositive"
      @handle-review-stop="handleReviewStop"
    ></ripa-admin-wrapper>
    <v-dialog v-model="submitDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          <span v-if="submitSelected">Submit selected stops?</span>
          <span v-if="!submitSelected">Submit all stops?</span>
        </v-card-title>

        <v-card-text>
          <span v-if="submitSelected"
            >This will only submit the stops you have selected to the DOJ.</span
          >
          <span v-if="!submitSelected"
            >This will submit all the stops to the DOJ based on the current
            filters you have set.</span
          >
          <br /><br />Note: Stops that are in an error state will not be
          re-submitted.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="darken-1" text @click="handleCloseSubmitDialog">
            Cancel
          </v-btn>

          <v-btn color="darken-1" text @click="handleSubmitDialogConfirm">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RipaAdminWrapper from '@/components/organisms/RipaAdminWrapper'

export default {
  name: 'ripa-admin-template',

  components: {
    RipaAdminWrapper,
  },

  data: function () {
    return {
      submitDialog: false,
      submitSelected: false,
      selectedStops: [],
      submitAllFilterData: null,
    }
  },

  methods: {
    handleRemoveOfficerGender() {
      this.$emit('handle-remove-officer-gender')
    },
    handleCallErrorCodeSearch(val) {
      this.$emit('handleCallErrorCodeSearch', val)
    },
    handleRedoItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', pageData)
    },
    handlePaginate(pageData) {
      this.$emit('handlePaginate', pageData)
    },
    handleAdminFiltering(filterData) {
      this.$emit('handleAdminFiltering', filterData)
    },
    handleGetPiiEntities(version) {
      this.$emit('handle-get-pii-entities', version)
    },
    handleMarkFalsePositive(id) {
      this.$emit('handle-mark-false-positive', id)
    },
    handleReviewStop(data) {
      this.$emit('handle-review-stop', data)
    },
    handleUpdateSavedFilter(val) {
      this.$emit('handleUpdateSavedFilter', val)
    },
    handleAdminSubmissionsItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', pageData)
    },
    handleSubmissionDetailItemsPerPage(pageData) {
      this.$emit('handleSubmissionDetailItemsPerPage', pageData)
    },
    handleSubmissionDetailPaginate(pageData) {
      this.$emit('handleSubmissionDetailPaginate', pageData)
    },
    handleSubmitStops(stops) {
      this.selectedStops = stops
      this.submitSelected = true
      this.submitDialog = true
    },
    handleSubmitAll(filterData) {
      this.submitAllFilterData = filterData
      this.submitSelected = false
      this.submitDialog = true
    },
    handleCloseSubmitDialog() {
      this.submitAllFilterData = null
      this.submitDialog = false
    },
    handleSubmitDialogConfirm() {
      if (this.submitSelected && this.selectedStops.length > 0) {
        this.$emit('handleSubmitStops', this.selectedStops)
      } else {
        this.$emit('handleSubmitAll', this.submitAllFilterData)
      }
      this.submitDialog = false
      this.selectedStops = []
      this.submitAllFilterData = null
    },
    handleCreateCpraReport(reportParameters) {
      this.$emit('handle-create-cpra-report', reportParameters)
    },
    handleDownloadCpraReport(fileName) {
      this.$emit('handle-download-cpra-report', fileName)
    },
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: () => {},
    },
    cpraReportStats: {
      type: Object,
      default: () => {},
    },
    beats: {
      type: Array,
      default: () => [],
    },
    cities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    schools: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    piiEntities: {
      type: Array,
      default: () => [],
    },
    stops: {
      type: Object,
      default: () => {},
    },
    submissions: {
      type: Object,
      default: () => {},
    },
    currentSubmission: {
      type: Object,
      default: () => {},
    },
    users: {
      type: Array,
      default: () => [],
    },
    historicalCpraReports: {
      type: Array,
      default: () => [],
    },
    errorCodeSearch: {
      type: Object,
      default: () => {},
    },
    onDeleteBeat: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
    onEditUser: {
      type: Function,
      default: () => {},
    },
    onUploadUsers: {
      type: Function,
      default: () => {},
    },
    onTabChange: {
      type: Function,
      default: () => {},
    },
    savedFilters: {
      type: Object,
      default: () => {},
    },
    onUploadDomain: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
