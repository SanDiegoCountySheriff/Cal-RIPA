<template>
  <v-card class="ripa-form-summary mx-auto" flat>
    <v-card-title class="tw-uppercase">Review and Submit</v-card-title>
    <v-card-text>
      <div class="tw-mb-2">
        <span class="tw-text-base tw-font-bold">Stop</span>
        <template v-if="editButtons">
          <v-btn class="tw-ml-4" dense outlined x-small @click="handleEditStop">
            Edit
          </v-btn>
        </template>
      </div>

      <div v-for="item in getApiStopStopSummary" :key="item.id">
        <ripa-list :item="item.content"></ripa-list>
      </div>

      <div
        v-for="(person, index) in apiStop.listPersonStopped"
        :key="person.id"
      >
        <div class="tw-my-4 tw-text-base tw-font-bold">
          Person {{ index + 1 }}
          <template v-if="editButtons">
            <v-btn
              class="tw-ml-4"
              dense
              outlined
              x-small
              @click="handleEditPerson($event, person.id)"
            >
              Edit
            </v-btn>
            <template v-if="apiStop.listPersonStopped.length > 1">
              <v-btn
                class="tw-ml-2"
                dense
                outlined
                x-small
                @click="handleDeletePerson($event, person.id)"
              >
                Delete
              </v-btn>
            </template>
          </template>
        </div>

        <div v-for="item in getApiStopPersonSummary(person.id)" :key="item.id">
          <ripa-list :item="item.content"></ripa-list>
        </div>

        <template v-if="anyAgencyQuestions">
          <div class="tw-my-4 tw-text-base tw-font-bold">
            <span class="tw-text-base tw-font-bold">Agency Questions</span>
            <template v-if="editButtons">
              <v-btn
                class="tw-ml-4"
                dense
                outlined
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
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import RipaList from '@/components/molecules/RipaList'
import {
  apiStopStopSummary,
  apiStopPersonSummary,
  apiStopAgencyQuestionsSummary,
} from '@/utilities/stop'

export default {
  name: 'ripa-form-summary',

  components: {
    RipaList,
  },

  computed: {
    anyAgencyQuestions() {
      return apiStopAgencyQuestionsSummary().length > 0
    },

    getApiStop() {
      return this.apiStop
    },

    getApiStopStopSummary() {
      return apiStopStopSummary(this.apiStop)
    },

    getApiStopAgencyQuestionsSummary() {
      return apiStopAgencyQuestionsSummary(this.apiStop)
    },
  },

  methods: {
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
    editButtons: {
      type: Boolean,
      default: false,
    },
    onDeletePerson: {
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
</style>
