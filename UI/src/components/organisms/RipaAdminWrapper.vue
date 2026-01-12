<template>
  <v-card>
    <v-tabs v-model="tabLevel1" show-arrows>
      <v-tab to="/admin/stops">Stops</v-tab>
      <v-tab to="/admin/submissions">Submissions</v-tab>
      <v-tab to="/admin/users">Users</v-tab>
      <v-tab to="/admin/domains">Domains</v-tab>
      <v-tab to="/admin/cpra">CPRA Report</v-tab>
      <v-tab to="/admin/piiReview">PII Review</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabLevel1">
      <v-tab-item value="/admin/stops" id="/admin/stops">
        <ripa-stops-grid
          :loading="loading"
          :items="stops"
          :errorCodeSearch="errorCodeSearch"
          :savedFilters="savedFilters"
          @callErrorCodeSearch="handleCallErrorCodeSearch"
          @redoItemsPerPage="handleAdminStopsRedoItemsPerPage"
          @paginate="handleAdminStopsPagination"
          @handleAdminStopsFiltering="handleAdminStopsFiltering"
          @handleUpdateSavedFilter="handleUpdateSavedFilter"
          @handleSubmitStops="handleSubmitStops"
          @handleSubmitStopsDirectly="handleSubmitStopsDirectly"
          @handleSubmitAll="handleSubmitAll"
        ></ripa-stops-grid>
      </v-tab-item>

      <v-tab-item value="/admin/submissions" id="/admin/submissions">
        <ripa-submissions-grid
          :loading="loading"
          :items="submissions"
          :currentSubmission="currentSubmission"
          :savedFilters="savedFilters"
          @paginate="handleAdminSubmissionPagination"
          @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
          @redoItemsPerPage="handleAdminSubmissionRedoItemsPerPage"
          @handleFilter="handleAdminSubmissionsFiltering"
          @handleUpdateSavedFilter="handleUpdateSavedFilter"
          @handleSubmissionDetailItemsPerPage="
            handleSubmissionDetailItemsPerPage
          "
        ></ripa-submissions-grid>
      </v-tab-item>

      <v-tab-item value="/admin/users" id="/admin/users">
        <ripa-users-grid
          :loading="loading"
          :items="users"
          :on-edit-user="onEditUser"
          :on-upload-users="onUploadUsers"
          @handle-remove-officer-gender="handleRemoveOfficerGender"
        ></ripa-users-grid>
      </v-tab-item>

      <v-tab-item value="/admin/cpra" id="/admin/cpra">
        <v-tabs v-model="tabLevel3" show-arrows>
          <v-tab>Generate CPRA Report</v-tab>
          <v-tab>Previous CPRA Reports</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabLevel3">
          <v-tab-item>
            <ripa-cpra-report
              :loading="loading"
              :user="user"
              :items="cpraReportStats"
              @handle-create-cpra-report="handleCreateCpraReport"
              @handle-download-cpra-report="handleDownloadCpraReport"
            ></ripa-cpra-report>
          </v-tab-item>
          <v-tab-item>
            <ripa-cpra-report-history
              :loading="loading"
              :items="historicalCpraReports"
              @handleDownloadCpraReport="handleDownloadCpraReport"
            ></ripa-cpra-report-history>
          </v-tab-item>
        </v-tabs-items>
      </v-tab-item>

      <v-tab-item value="/admin/piiReview" id="/admin/piiReview">
        <ripa-pii-review
          :pii-entities="piiEntities"
          :loading="loading"
          @get-pii-entities="handleGetPiiEntities"
          @handle-mark-false-positive="handleMarkFalsePositive"
          @handle-review-stop="handleReviewStop"
        ></ripa-pii-review>
      </v-tab-item>

      <v-tab-item value="/admin/domains" id="/admin/domains">
        <v-tabs v-model="tabLevel2" show-arrows>
          <template v-if="displayBeatInput">
            <v-tab>Beats</v-tab>
          </template>
          <v-tab>Cities</v-tab>
          <v-tab>Schools</v-tab>
          <v-tab>Statutes</v-tab>
          <v-spacer></v-spacer>
          <v-dialog v-model="fileDialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="tw-mb-2 mr-4"
                v-bind="attrs"
                v-on="on"
              >
                Upload CLEW Data
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>Upload CLEW Data</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <p>
                        This data is provided by CA DOJ and maintained
                        periodically on CLEW (<a
                          href="https://clew.doj.ca.gov/sd-ab953"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://clew.doj.ca.gov/sd-ab953 </a
                        >) and can be downloaded in the form of an .xlsx file.
                        Do not modify the default sheets.
                      </p>
                      <div class="text-h6">Optional</div>
                      <p>
                        A sheet named 'Beat_Table' may be added to include your
                        agency's beats with the following columns in this
                        <u>exact</u>
                        order.
                      </p>
                      <p>Required Columns:</p>
                      <ul class="mb-6">
                        <li>'Id'</li>
                        <li>'Community'</li>
                        <li>'Command'</li>
                      </ul>
                      <p>Optional Columns:</p>
                      <ul>
                        <li>'CommandAuditGroup'</li>
                        <li>'CommandAuditSize'</li>
                      </ul>
                      <v-file-input
                        v-model="domainFile"
                        prepend-icon="mdi-paperclip"
                        label="Upload CLEW file"
                        accept=".xlsx"
                        :rules="fileRules"
                      >
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeFileDialog">
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="isInvalidUploadForm"
                  color="blue darken-1"
                  text
                  @click="uploadClew"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-tabs>

        <v-tabs-items v-model="tabLevel2">
          <template v-if="displayBeatInput">
            <v-tab-item>
              <ripa-beats-grid
                :loading="loading"
                :items="beats"
                :on-delete-beat="onDeleteBeat"
                :on-edit-beat="onEditBeat"
              ></ripa-beats-grid>
            </v-tab-item>
          </template>
          <v-tab-item>
            <ripa-cities-grid
              :loading="loading"
              :items="cities"
            ></ripa-cities-grid>
          </v-tab-item>
          <v-tab-item>
            <ripa-schools-grid
              :loading="loading"
              :items="schools"
            ></ripa-schools-grid>
          </v-tab-item>
          <v-tab-item>
            <ripa-statutes-grid
              :loading="loading"
              :items="statutes"
            ></ripa-statutes-grid>
          </v-tab-item>
        </v-tabs-items>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import RipaBeatsGrid from '@/components/molecules/RipaBeatsGrid'
import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid'
import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid'
import RipaStopsGrid from '@/components/molecules/RipaStopsGrid'
import RipaSubmissionsGrid from '@/components/molecules/RipaSubmissionsGrid'
import RipaUsersGrid from '@/components/molecules/RipaUsersGrid'
import RipaCpraReport from '@/components/molecules/RipaCpraReport'
import RipaCpraReportHistory from '@/components/molecules/RipaCpraReportHistory'
import RipaPiiReview from '@/components/molecules/RipaPiiReview'

export default {
  name: 'ripa-admin-wrapper',

  components: {
    RipaBeatsGrid,
    RipaCitiesGrid,
    RipaSchoolsGrid,
    RipaStatutesGrid,
    RipaStopsGrid,
    RipaSubmissionsGrid,
    RipaUsersGrid,
    RipaCpraReport,
    RipaCpraReportHistory,
    RipaPiiReview,
  },

  data() {
    return {
      tabLevel1: 0,
      tabLevel2: 0,
      tabLevel3: 0,
      fileDialog: false,
      domainFile: null,
    }
  },

  watch: {
    tabLevel1(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.tabLevel1 = newValue
        if (this.onTabChange) {
          this.onTabChange(newValue)
        }
      }
    },
    fileDialog(val) {
      val || this.closeFileDialog()
    },
  },

  computed: {
    fileRules() {
      return [
        v => !!v || 'A CLEW file is required',
        v => (v && v.name.split('.').pop() === 'xlsx') || 'File must be .xlsx',
      ]
    },
    isInvalidUploadForm() {
      return (
        this.domainFile === null ||
        this.domainFile.name.split('.').pop() !== 'xlsx'
      )
    },
  },

  methods: {
    handleRemoveOfficerGender() {
      this.$emit('handle-remove-officer-gender')
    },
    handleCallErrorCodeSearch(val) {
      this.$emit('handleCallErrorCodeSearch', val)
    },
    handleAdminStopsRedoItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', {
        type: 'stops',
        ...pageData,
      })
    },
    handleAdminStopsPagination(pageData) {
      this.$emit('handlePaginate', {
        // add in the type in the wrapper
        type: 'stops',
        ...pageData,
      })
    },
    handleAdminStopsFiltering(filterData) {
      this.$emit('handleAdminFiltering', {
        type: 'stops',
        ...filterData,
      })
    },
    handleAdminSubmissionPagination(pageData) {
      this.$emit('handlePaginate', {
        // add in the type in the wrapper
        type: 'submission',
        ...pageData,
      })
    },
    handleAdminSubmissionRedoItemsPerPage(pageData) {
      this.$emit('handleRedoItemsPerPage', {
        type: 'submission',
        ...pageData,
      })
    },
    handleUpdateSavedFilter(val) {
      this.$emit('handleUpdateSavedFilter', val)
    },
    handleSubmissionDetailItemsPerPage(pageData) {
      this.$emit('handleSubmissionDetailItemsPerPage', pageData)
    },
    handleSubmissionDetailPaginate(pageData) {
      this.$emit('handleSubmissionDetailPaginate', pageData)
    },
    handleAdminSubmissionsFiltering(filterData) {
      this.$emit('handleAdminFiltering', {
        type: 'submission',
        ...filterData,
      })
    },
    handleSubmitStops(stops) {
      this.$emit('handleSubmitStops', stops)
    },
    handleSubmitStopsDirectly(stops) {
      this.$emit('handleSubmitStopsDirectly', stops)
    },
    handleSubmitAll(filterData) {
      this.$emit('handleSubmitAll', filterData)
    },
    handleGetPiiEntities(version) {
      this.$emit('handle-get-pii-entities', version)
    },
    handleMarkFalsePositive(id) {
      this.$emit('handle-mark-false-positive', id)
    },
    closeFileDialog() {
      this.fileDialog = false
      this.domainFile = null
    },
    uploadClew() {
      if (this.domainFile) {
        this.onUploadDomain(this.domainFile)
        this.domainFile = null
      }

      this.closeFileDialog()
    },
    handleCreateCpraReport(reportParameters) {
      this.$emit('handle-create-cpra-report', reportParameters)
    },
    handleDownloadCpraReport(fileName) {
      this.$emit('handle-download-cpra-report', fileName)
    },
    handleReviewStop(data) {
      this.$emit('handle-review-stop', data)
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
    stops: {
      type: Object,
      default: () => {},
    },
    piiEntities: {
      type: Array,
      default: () => [],
    },
    submissions: {
      type: Object,
      default: () => {},
    },
    currentSubmission: {
      type: Object,
      default: () => {},
    },
    errorCodeSearch: {
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

<style scoped="true">
* >>> .v-dialog {
  overflow-y: visible;
}
</style>
