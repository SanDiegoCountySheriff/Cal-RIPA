<template>
  <v-card>
    <v-tabs v-model="tabLevel1" show-arrows>
      <v-tab to="/admin/submissions">Submissions</v-tab>
      <v-tab to="/admin/stops">Stops</v-tab>
      <v-tab to="/admin/users">Users</v-tab>
      <v-tab to="/admin/domains">Domains</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabLevel1">
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
          @handleSubmitAll="handleSubmitAll"
        ></ripa-stops-grid>
      </v-tab-item>

      <v-tab-item value="/admin/users" id="/admin/users">
        <ripa-users-grid
          :loading="loading"
          :items="users"
          :on-edit-user="onEditUser"
          :on-upload-users="onUploadUsers"
        ></ripa-users-grid>
      </v-tab-item>

      <v-tab-item value="/admin/domains" id="/admin/domains">
        <v-tabs v-model="tabLevel2" show-arrows>
          <template v-if="displayBeatInput">
            <v-tab>Beats</v-tab>
          </template>
          <v-tab>Cities</v-tab>
          <v-tab>Schools</v-tab>
          <v-tab>Statutes</v-tab>
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
  },

  data() {
    return {
      tabLevel1: 0,
      tabLevel2: 0,
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
  },

  methods: {
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
    handleSubmitAll(filterData) {
      this.$emit('handleSubmitAll', filterData)
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
    errorCodeSearch: {
      type: Object,
      default: () => {},
    },
    users: {
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
  },
}
</script>
