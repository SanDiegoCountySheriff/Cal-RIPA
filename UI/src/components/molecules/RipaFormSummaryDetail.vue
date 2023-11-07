<template>
  <div>
    <v-card-title class="tw-uppercase">{{ title }}</v-card-title>
    <v-card-text>
      <div class="tw-mb-3">
        <span class="tw-text-base tw-font-bold">{{ getApiStopId }}</span>
        <template v-if="editButtons">
          <v-btn class="tw-ml-4" color="primary" small @click="handleEditStop">
            Edit
          </v-btn>
        </template>
      </div>

      <div v-for="item in getApiStopStopSummary" :key="item.id">
        <ripa-list :item="item.content"></ripa-list>
      </div>

      <div
        v-for="(person, index) in apiStop.listPersonStopped"
        :key="person.index"
      >
        <div class="tw-my-4 tw-text-base tw-font-bold">
          Person {{ index + 1 }}
          <template v-if="editButtons">
            <v-btn
              class="tw-ml-4"
              color="primary"
              small
              @click="handleEditPerson($event, person.index)"
            >
              Edit
            </v-btn>
            <template v-if="!isAdminEditing">
              <v-btn
                class="tw-ml-2"
                color="primary"
                small
                @click="handleCopyPerson($event, person.index)"
              >
                Copy
              </v-btn>
            </template>
            <template
              v-if="apiStop.listPersonStopped.length > 1 && !isAdminEditing"
            >
              <v-btn
                class="tw-ml-2"
                color="primary"
                small
                @click="handleDeletePerson($event, person.index)"
              >
                Delete
              </v-btn>
            </template>
          </template>
        </div>

        <div v-for="item in getApiStopPersonSummary(person.id)" :key="item.id">
          <ripa-list :item="item.content"></ripa-list>
        </div>
      </div>

      <template v-if="anyAgencyQuestions">
        <div class="tw-my-4 tw-text-base tw-font-bold">
          <span class="tw-text-base tw-font-bold">Agency Questions</span>
          <template v-if="editButtons">
            <v-btn
              class="tw-ml-4"
              color="primary"
              small
              @click="handleEditAgencyQuestions"
            >
              Edit
            </v-btn>
          </template>
        </div>

        <div v-for="item in getApiStopAgencyQuestionsSummary" :key="item.id">
          <ripa-list :item="item.content"></ripa-list>
        </div>
      </template>

      <div class="tw-mt-4 tw-mb-2">
        <v-divider></v-divider>
      </div>

      <template v-if="isAdminEditing || isAdminViewing">
        <div class="tw-my-4 tw-text-base tw-font-bold">
          <span class="tw-text-base tw-font-bold">Telemetry</span>
        </div>

        <ripa-list :item="getApiStopEditExplanation"></ripa-list>

        <div v-for="item in getApiStopTelemetrySummary" :key="item.id">
          <ripa-list :item="item.content"></ripa-list>
        </div>

        <div v-for="(submission, index) in getSubmissions" :key="submission.id">
          <div class="tw-my-4 tw-text-base tw-font-bold">
            Submission {{ index + 1 }}
          </div>

          <div
            v-for="item in getApiStopSubmissionSummary(submission)"
            :key="item.id"
          >
            <ripa-list :item="item.content"></ripa-list>
          </div>
        </div>
      </template>
    </v-card-text>
  </div>
</template>

<script>
import RipaList from '@/components/molecules/RipaList'
import {
  apiStopStopSummary,
  apiStopPersonSummary,
  apiStopAgencyQuestionsSummary,
  apiStopTelemetrySummary,
  apiStopSubmissionSummary,
  apiStopEditExplanationSummary,
} from '@/utilities/stop'

export default {
  name: 'ripa-form-summary-detail',

  components: {
    RipaList,
  },

  inject: ['isAdminEditing', 'isAdminViewing'],

  computed: {
    anyAgencyQuestions() {
      const questions = this.apiStop?.listAgencyQuestion || []
      return questions.length > 0
    },

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

    getApiStopEditExplanation() {
      return apiStopEditExplanationSummary(this.apiStop)
    },
  },

  methods: {
    getApiStopSubmissionSummary(submission) {
      return apiStopSubmissionSummary(submission)
    },

    getApiStopPersonSummary(personId) {
      return apiStopPersonSummary(this.apiStop, personId)
    },

    handleEditStop(event) {
      event.stopPropagation()
      this.$emit('on-edit-stop')
    },

    handleEditPerson(event, id) {
      event.stopPropagation()
      this.$emit('on-edit-person', id)
    },

    handleCopyPerson(event, id) {
      event.stopPropagation()
      this.$emit('on-copy-person', id)
    },

    handleDeletePerson(event, id) {
      event.stopPropagation()
      this.$emit('on-delete-person', id)
    },

    handleEditAgencyQuestions(event) {
      event.stopPropagation()
      this.$emit('on-edit-agency-questions')
    },
  },

  props: {
    apiStop: {
      type: Object,
    },
    title: {
      type: String,
      default: 'Review, Edit and Submit',
    },
    editButtons: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
