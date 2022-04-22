<template>
  <div>
    <v-card-title class="tw-uppercase">{{ title }}</v-card-title>
    <v-card-text>
      <div class="tw-mb-3">
        <span class="tw-text-base tw-font-bold">{{ getApiStopId }}</span>
        <template v-if="editButtons">
          <v-btn
            class="tw-ml-4"
            color="primary"
            x-small
            @click="handleEditStop"
          >
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
              x-small
              @click="handleEditPerson($event, person.index)"
            >
              Edit
            </v-btn>
            <template v-if="!adminEditing">
              <v-btn
                class="tw-ml-2"
                color="primary"
                x-small
                @click="handleCopyPerson($event, person.index)"
              >
                Copy
              </v-btn>
            </template>
            <template
              v-if="apiStop.listPersonStopped.length > 1 && !adminEditing"
            >
              <v-btn
                class="tw-ml-2"
                color="primary"
                x-small
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
              x-small
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

      <template v-if="adminEditing || adminViewing">
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

  props: {
    apiStop: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: 'Review, Edit and Submit',
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
      required: false,
      default: () => {},
    },
    onCopyPerson: {
      type: Function,
      required: false,
      default: () => {},
    },
    onEditAgencyQuestions: {
      type: Function,
      required: true,
    },
    onEditStop: {
      type: Function,
      required: true,
    },
    onEditPerson: {
      type: Function,
      required: true,
    },
  },
}
</script>
