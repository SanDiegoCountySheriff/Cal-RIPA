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

          <template v-if="submissionBlockedByCooldown">
            <v-divider class="my-4"></v-divider>
            <v-alert
              dense
              text
              type="error"
              border="left"
              colored-border
              icon="mdi-alert-circle-outline"
            >
              <div>
                Your system is currently configured to allow backdating stops
                for
                <strong
                  >{{ maxBackdateDays }} day{{
                    maxBackdateDays === 1 ? '' : 's'
                  }}</strong
                >.
              </div>

              <div>
                Stops must be at least
                <strong
                  >{{ cooldownDays }} day{{ cooldownDays === 1 ? '' : 's' }}
                </strong>
                old before submission.
              </div>

              <template v-if="submitSelected">
                <div class="mt-2">
                  One or more selected stops are too recent. Unselect them and
                  try again.
                </div>
              </template>

              <template v-else>
                <div class="mt-2">
                  Your current filters include stops that may be too recent. Set
                  the
                  <strong>To Date</strong> filter to
                  <strong>{{ requiredStopToDate }}</strong> (or earlier) and try
                  again.
                </div>
              </template>

              <template v-if="submitSelected && cooldownStopIds.length">
                <v-divider class="my-2"></v-divider>
                <div>Stops too recent to submit:</div>
                <v-chip-group column>
                  <v-chip
                    v-for="stopId in cooldownStopIds"
                    :key="stopId"
                    label
                    small
                    outlined
                    color="primary"
                    class="mr-2 mb-2"
                  >
                    {{ stopId }}
                  </v-chip>
                </v-chip-group>
              </template>
            </v-alert>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="darken-1" text @click="handleCloseSubmitDialog">
            Cancel
          </v-btn>

          <v-btn
            :disabled="submissionBlockedByCooldown"
            @click="handleSubmitDialogConfirm"
            color="darken-1"
            text
          >
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

  computed: {
    parseToLocalMidnightDate() {
      return value => {
        if (!value) return null
        if (value instanceof Date && !isNaN(value.getTime())) {
          return new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
          )
        }

        if (typeof value !== 'string') return null

        const trimmed = value.trim()
        if (!trimmed) return null

        const dateOnly = trimmed.includes('T') ? trimmed.split('T')[0] : trimmed

        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateOnly)) {
          const [yyyy, mm, dd] = dateOnly.split('-').map(Number)
          return new Date(yyyy, mm - 1, dd)
        }

        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateOnly)) {
          const [mm, dd, yyyy] = dateOnly.split('/').map(Number)
          return new Date(yyyy, mm - 1, dd)
        }

        return null
      }
    },
    maxBackdateDays() {
      if (this.submitSelected && this.selectedStops) {
        return this.selectedStops.maxBackdateDays || 0
      }
      if (!this.submitSelected && this.submitAllFilterData) {
        return this.submitAllFilterData.maxBackdateDays || 0
      }
      return 0
    },
    cooldownStopIds() {
      if (this.submitSelected && this.selectedStops) {
        return this.selectedStops.cooldownStopIds || []
      }
      if (!this.submitSelected && this.submitAllFilterData) {
        return this.submitAllFilterData.cooldownStopIds || []
      }
      return []
    },
    hasCooldownStops() {
      return this.cooldownStopIds.length > 0
    },
    cooldownDays() {
      if (this.submitSelected && this.selectedStops) {
        return this.selectedStops.cooldownDays || 0
      }
      if (!this.submitSelected && this.submitAllFilterData) {
        return this.submitAllFilterData.cooldownDays || 0
      }
      return 0
    },
    requiredStopToDateDate() {
      if (!this.maxBackdateDays || this.maxBackdateDays <= 0) {
        return null
      }
      const now = new Date()
      const requiredDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      )
      requiredDate.setDate(requiredDate.getDate() - this.cooldownDays)
      return requiredDate
    },
    requiredStopToDate() {
      if (!this.requiredStopToDateDate) return null
      const yyyy = this.requiredStopToDateDate.getFullYear()
      const mm = String(this.requiredStopToDateDate.getMonth() + 1).padStart(
        2,
        '0',
      )
      const dd = String(this.requiredStopToDateDate.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    submissionBlockedByCooldown() {
      if (!this.maxBackdateDays || this.maxBackdateDays <= 0) {
        return false
      }

      if (this.submitSelected) {
        return this.hasCooldownStops
      }

      return this.hasCooldownStops
    },
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
      if (this.submissionBlockedByCooldown) {
        return
      }
      if (this.submitSelected && this.selectedStops) {
        this.$emit('handleSubmitStops', this.selectedStops.stopIds || [])
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
