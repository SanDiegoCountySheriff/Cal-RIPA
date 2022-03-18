<template>
  <div>
    <div v-if="adminEditing">
      <v-card class="ripa-form-summary mx-auto" :loading="this.loading" flat>
        <v-tabs show-arrows>
          <v-tab>Current State</v-tab>
          <v-tab-item>
            <ripa-form-summary-detail
              :apiStop="apiStop"
              :adminEditing="adminEditing"
              :editButtons="editButtons"
              :onEditAgencyQuestions="onEditAgencyQuestions"
              :onEditStop="onEditStop"
              :onEditPerson="onEditPerson"
            ></ripa-form-summary-detail>
          </v-tab-item>
          <v-tab v-for="stopAudit of this.stopAudits" :key="stopAudit.id">
            {{ getStopAuditDate(stopAudit.id) }}
          </v-tab>
          <v-tab-item v-for="stopAudit of this.stopAudits" :key="stopAudit.id">
            <ripa-form-summary-detail
              :apiStop="stopAudit"
              :adminEditing="adminEditing"
              :title="getStopAuditTitle(stopAudit)"
            ></ripa-form-summary-detail>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </div>
    <div v-else-if="adminViewing">
      <v-card class="ripa-form-summary mx-auto" :loading="this.loading" flat>
        <v-tabs show-arrows>
          <v-tab>Current State</v-tab>
          <v-tab-item>
            <ripa-form-summary-detail
              :apiStop="apiStop"
              :adminViewing="adminViewing"
              title="View Stop"
            ></ripa-form-summary-detail>
          </v-tab-item>
          <v-tab v-for="stopAudit of this.stopAudits" :key="stopAudit.id">
            {{ getStopAuditDate(stopAudit.id) }}
          </v-tab>
          <v-tab-item v-for="stopAudit of this.stopAudits" :key="stopAudit.id">
            <ripa-form-summary-detail
              :apiStop="stopAudit"
              :admin-viewing="adminViewing"
              :title="getStopAuditTitle(stopAudit)"
            ></ripa-form-summary-detail>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </div>
    <div v-else>
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
    }
  },

  created() {
    const submittedStop = JSON.parse(
      localStorage.getItem('ripa_form_submitted_api_stop'),
    )
    if (submittedStop?.isEdited) {
      this.getStopAudits()
    }
  },

  methods: {
    ...mapActions(['getAdminStopAudits']),

    async getStopAudits() {
      this.loading = true
      this.stopAudits = await this.getAdminStopAudits(this.apiStop.id)
      this.stopAudits.sort((a, b) => (a.id < b.id ? 1 : b.id < a.id ? -1 : 0))
      this.loading = false
    },

    getStopAuditDate(stopAuditId) {
      const stopAuditDate = stopAuditId.toString().split('-')[1]
      const parsedDate = new Date(
        Date.UTC(
          stopAuditDate.substring(0, 4),
          stopAuditDate.substring(4, 6) - 1,
          stopAuditDate.substring(6, 8),
          stopAuditDate.substring(8, 10),
          stopAuditDate.substring(10, 12),
        ),
      )
        .toISOString()
        .split('T')[0]
      return parsedDate
    },

    getStopAuditTime(stopAuditId) {
      const stopAuditDate = stopAuditId.toString().split('-')[1]
      const parsedTime = new Date(
        Date.UTC(
          stopAuditDate.substring(0, 4),
          stopAuditDate.substring(4, 6) - 1,
          stopAuditDate.substring(6, 8),
          stopAuditDate.substring(8, 10),
          stopAuditDate.substring(10, 12),
        ),
      ).toLocaleTimeString('en-US')
      return parsedTime
    },

    getStopAuditTitle(stopAudit) {
      return `State before edit on: ${this.getStopAuditDate(
        stopAudit.id,
      )} ${this.getStopAuditTime(stopAudit.id)}`
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
    adminViewing: {
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
