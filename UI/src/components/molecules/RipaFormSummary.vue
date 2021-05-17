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
        Stop
        <v-btn class="tw-ml-4" dense outlined x-small @click="handleEditStop">
          Edit
        </v-btn>
      </div>
      <div>Person Count: {{ apiStop.listPersonStopped.length }}</div>

      <div class="tw-mt-8">Date: {{ apiStop.date }}</div>
      <div>Time: {{ apiStop.time }}</div>
      <div>Location</div>
      <div>Duration (m): {{ apiStop.stopDuration }}</div>

      <div
        v-for="(person, index) in apiStop.listPersonStopped"
        :key="person.id"
      >
        <div class="tw-mt-4">
          Person {{ index + 1 }}
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
      </div>

      <!-- <div>Perceived Race</div>
      <div>White</div>
      <div>Perceived Age: 31-60</div>
      <div>Perceived Gender: Male</div>
      <div>Perceived LGBT: No</div>
      <div>Perceived Disability</div>
      <div>Reason for Stop</div>
      <div>Traffic Violation</div>
      <div>Motor Violation</div>
      <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>
      <div>Reason for Stop Explanation</div>
      <div>Speeding</div>
      <div>Actions Taken During Stop</div>
      <div>None</div>
      <div>Contraband Or Evidence Discovered</div>
      <div>None</div>
      <div>Result of Stop</div>
      <div>Citation for infraction</div>
      <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>-->
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-form-summary',

  computed: {
    getApiStop() {
      return this.apiStop
    },
  },

  methods: {
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
