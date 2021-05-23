<template>
  <v-card class="ripa-form-summary mx-auto" flat>
    <v-card-title class="tw-uppercase">Review and Submit</v-card-title>

    <v-card-text>
      <!-- <div class="tw-mt-4">
        {{ stop }}
      </div>
      <v-divider></v-divider> -->
      <div class="tw-mt-4">
        {{ apiStop }}
      </div>
      <!-- <v-divider></v-divider>
      <div class="tw-my-4">
        {{ getFullStop.listPersonStopped[0] }}
      </div>
      <v-divider></v-divider>
      <div class="tw-my-4">
        {{ getFullStop.listPersonStopped[1] }}
      </div>
      <v-divider></v-divider> -->

      <div>
        <span class="tw-text-base tw-font-bold">Stop</span>
        <v-btn class="tw-ml-4" dense outlined x-small @click="handleEditStop">
          Edit
        </v-btn>
      </div>

      <div v-for="(item, index) in getApiStopStopSummary" :key="index">
        <ripa-list :item="item"></ripa-list>
      </div>

      <div
        v-for="(person, index) in apiStop.listPersonStopped"
        :key="person.id"
      >
        <div class="tw-mt-4 tw-text-base tw-font-bold">
          Person {{ index + 1 }} ({{ person.id }})
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
        </div>

        <div
          v-for="(item, index) in getApiStopPersonSummary(person.id)"
          :key="index"
        >
          <ripa-list :item="item"></ripa-list>
        </div>

        <!-- <ripa-list :item="getStudent(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getPerceivedRace(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getPerceivedAge(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getPerceivedGender(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getGenderConforming(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getPerceivedLgbt(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getLimitedEnglish(person.id)"></ripa-list> -->
        <!-- <ripa-list :item="getPerceivedDisability(person.id)"></ripa-list> -->
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import RipaList from '@/components/molecules/RipaList'
import { apiStopStopSummary, apiStopPersonSummary } from '@/utilities/stop'

export default {
  name: 'ripa-form-summary',

  components: {
    RipaList,
  },

  computed: {
    getApiStop() {
      return this.apiStop
    },

    getApiStopStopSummary() {
      return apiStopStopSummary(this.apiStop)
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
  },

  props: {
    apiStop: {
      type: Object,
      default: () => {},
    },
    onDeletePerson: {
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
