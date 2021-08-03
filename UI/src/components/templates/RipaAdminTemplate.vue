<template>
  <div>
    <ripa-admin-wrapper
      :loading="loading"
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :statutes="statutes"
      :stops="stops"
      :submissions="submissions"
      :currentSubmission="currentSubmission"
      :users="users"
      :errorCodeSearch="errorCodeSearch"
      :display-beat-input="displayBeatInput"
      :on-delete-beat="onDeleteBeat"
      :on-delete-city="onDeleteCity"
      :on-delete-school="onDeleteSchool"
      :on-delete-statute="onDeleteStatute"
      :on-edit-beat="onEditBeat"
      :on-edit-city="onEditCity"
      :on-edit-school="onEditSchool"
      :on-edit-statute="onEditStatute"
      :on-edit-user="onEditUser"
      :on-upload-users="onUploadUsers"
      :on-tab-change="onTabChange"
      :savedFilters="savedFilters"
      @handleCallErrorCodeSearch="handleCallErrorCodeSearch"
      @handleRedoItemsPerPage="handleRedoItemsPerPage"
      @handlePaginate="handlePaginate"
      @handleAdminFiltering="handleAdminFiltering"
      @handleUpdateSavedFilter="handleUpdateSavedFilter"
      @handleSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
      @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
      @handleSubmitStops="handleSubmitStops"
      @handleSubmitAll="handleSubmitAll"
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
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
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
    },
    users: {
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
    onDeleteCity: {
      type: Function,
      default: () => {},
    },
    onDeleteSchool: {
      type: Function,
      default: () => {},
    },
    onDeleteStatute: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
    onEditCity: {
      type: Function,
      default: () => {},
    },
    onEditSchool: {
      type: Function,
      default: () => {},
    },
    onEditStatute: {
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
  },
}
</script>
