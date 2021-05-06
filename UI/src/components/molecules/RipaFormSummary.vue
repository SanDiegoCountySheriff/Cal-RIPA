<template>
  <div class="ripa-form-summary">
    <v-expansion-panels v-model="panels" accordion flat multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Stop</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div>Person Count: 2</div>

          <div class="tw-mt-8">Date: 2021-05-06</div>
          <div>Time: 12:37</div>
          <div>Location</div>
          <div>Duration (m): 21-30</div>
          <v-btn class="tw-mt-2" dense outlined x-small>Edit Stop</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Person 1</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="tw-mt-8">Person 1</div>
          <div>Perceived Race</div>
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
          <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>
          <div class="tw-flex tw-mt-2">
            <v-btn dense outlined x-small>Edit Person 1</v-btn>
            <v-btn class="tw-ml-2" dense outlined x-small
              >Delete Person 1</v-btn
            >
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Person 2</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="tw-mt-8">Person 2</div>
          <div>Perceived Race</div>
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
          <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>
          <div class="tw-flex tw-mt-2">
            <v-btn dense outlined x-small>Edit Person 2</v-btn>
            <v-btn class="tw-ml-2" dense outlined x-small
              >Delete Person 2</v-btn
            >
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- <div>Person Count: 2</div>

      <div class="tw-mt-8">Date: 2021-05-06</div>
      <div>Time: 12:37</div>
      <div>Location</div>
      <div>Duration (m): 21-30</div>
      <v-btn class="tw-mt-2" dense outlined x-small>Edit Stop</v-btn>

      <div class="tw-mt-8">Person 1</div>
      <div>Perceived Race</div>
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
      <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>
      <div class="tw-flex tw-mt-2">
        <v-btn dense outlined x-small>Edit Person 1</v-btn>
        <v-btn class="tw-ml-2" dense outlined x-small>Delete Person 1</v-btn>
      </div>

      <div class="tw-mt-8">Person 2</div>
      <div>Perceived Race</div>
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
      <div>22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106</div>
      <div class="tw-flex tw-mt-2">
        <v-btn dense outlined x-small>Edit Person 2</v-btn>
        <v-btn class="tw-ml-2" dense outlined x-small>Delete Person 2</v-btn>
      </div> -->
  </div>
</template>

<script>
export default {
  name: 'ripa-form-summary',

  data() {
    return {
      panels: [0, 1, 2],
    }
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-form-summary {
  border: 1px solid #ccc;
  width: 99%;
}
</style>
