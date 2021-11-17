<template>
  <div>
    <div v-if="adminEditing">
      <v-card class="ripa-form-summary mx-auto" :loading="this.loading" flat>
        <v-tabs>
          <v-tab>Current State</v-tab>
          <v-tab-item>
            <ripa-form-summary-detail
              :apiStop="apiStop"
              :adminEditing="adminEditing"
              :editButtons="editButtons"
              :onDeletePerson="onDeletePerson"
              :onCopyPerson="onCopyPerson"
              :onEditAgencyQuestions="onEditAgencyQuestions"
              :onEditStop="onEditStop"
              :onEditPerson="onEditPerson"
            ></ripa-form-summary-detail>
          </v-tab-item>
          <v-tab v-for="stopAudit of this.stopAudits" :key="stopAudit.id">{{
            stopAudit.id
          }}</v-tab>
          <v-tab-item v-for="stopAudit of this.stopAudits" :key="stopAudit.id">
            <ripa-form-summary-detail
              :apiStop="stopAudit"
              :adminEditing="adminEditing"
            ></ripa-form-summary-detail>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </div>
    <div v-if="!adminEditing">
      <v-card class="ripa-form-summary mx-auto" :loading="this.loading" flat>
        <ripa-form-summary-detail
          :apiStop="apiStop"
          :adminEditing="adminEditing"
          :editButtons="editButtons"
          :onDeletePerson="onDeletePerson"
          :onCopyPerson="onCopyPerson"
          :onEditAgencyQuestions="onEditAgencyQuestions"
          :onEditStop="onEditStop"
          :onEditPerson="onEditPerson"
        ></ripa-form-summary-detail>
      </v-card>
    </div>
  </div>
</template>

<script>
import RipaFormSummaryDetail from '@/components/molecules/RipaFormSummaryDetail'

import {
  apiStopStopSummary,
  apiStopPersonSummary,
  apiStopAgencyQuestionsSummary,
  apiStopTelemetrySummary,
  apiStopSubmissionSummary,
} from '@/utilities/stop'
import { mapActions } from 'vuex'

export default {
  name: 'ripa-form-summary',

  components: {
    RipaFormSummaryDetail,
  },

  data() {
    return {
      loading: false,
      stopAudits: [],
      hasStopAudits: false,
    }
  },

  created() {
    this.getStopAudits()
  },

  computed: {
    getApiStop() {
      return this.apiStop
    },

    getApiStopId() {
      return this.apiStop.id === 0 ? 'Unsaved Stop' : this.apiStop.id
    },

    getApiStopStopSummary() {
      return apiStopStopSummary(this.apiStop)
    },

    getApiStopAgencyQuestionsSummary() {
      return apiStopAgencyQuestionsSummary(this.apiStop)
    },

    getApiStopTelemetrySummary() {
      return apiStopTelemetrySummary(this.apiStop)
    },

    getSubmissions() {
      const value = localStorage.getItem('ripa_form_submitted_submissions')
      return value ? JSON.parse(value) : []
    },
  },

  methods: {
    ...mapActions(['getAdminStopAudits']),

    async getStopAudits() {
      this.loading = true
      this.stopAudits = await this.getAdminStopAudits(this.apiStop.id)
      if (this.stopAudits.length > 0) {
        this.hasStopAudits = true
      }
      this.loading = false
    },

    getApiStopSubmissionSummary(submission) {
      return apiStopSubmissionSummary(submission)
    },

    getApiStopPersonSummary(personId) {
      return apiStopPersonSummary(this.apiStop, personId)
    },

    handleEditStop(event) {
      event.stopPropagation()
      if (this.onEditStop) {
        this.onEditStop()
      }
    },

    handleEditPerson(event, id) {
      event.stopPropagation()
      if (this.onEditPerson) {
        this.onEditPerson(id)
      }
    },

    handleCopyPerson(event, id) {
      event.stopPropagation()
      if (this.onCopyPerson) {
        this.onCopyPerson(id)
      }
    },

    handleDeletePerson(event, id) {
      event.stopPropagation()
      if (this.onDeletePerson) {
        this.onDeletePerson(id)
      }
    },

    handleEditAgencyQuestions(event) {
      event.stopPropagation()
      if (this.onEditAgencyQuestions) {
        this.onEditAgencyQuestions()
      }
    },
  },

  watch: {
    stopAudits(value) {
      if (value.length > 0) {
        this.hasStopAudits = true
      }
    },
  },

  props: {
    apiStop: {
      type: Object,
      default: () => {},
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    editButtons: {
      type: Boolean,
      default: false,
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
    },
    onCopyPerson: {
      type: Function,
      default: () => {},
    },
    onEditAgencyQuestions: {
      type: Function,
      default: () => {},
    },
    onEditStop: {
      type: Function,
      default: () => {},
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-form-summary {
  width: 90%;
  border: 1px solid #ccc !important;
}
.v-sheet.v-card {
  border-radius: 4px;
}
.v-window {
  border-radius: 4px;
}
</style>
