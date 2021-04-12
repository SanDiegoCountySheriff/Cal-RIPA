<template>
  <div class="ripa-stop-reason tw-p-4">
    <ripa-header value="Reason for Stop"></ripa-header>

    <v-select
      v-model="reason"
      clerable
      dense
      flat
      item-text="name"
      item-value="value"
      label="Reason"
      required
      :items="items"
      :rules="reasonRules"
    ></v-select>

    <template v-if="reason === 1">
      <div>
        <v-radio-group v-model="trafficViolation">
          <v-radio label="Moving Violation" value="1A"></v-radio>
          <v-radio label="Equipment Violation" value="1B"></v-radio>
          <v-radio
            label="Non-moving Violation, including Registration Violation"
            value="1C"
          ></v-radio>
        </v-radio-group>
        <div class="tw-mt-2"></div>

        <ripa-autocomplete
          v-model="trafficViolationCode"
          hint="Select 1 Offense Code (required)"
          item-text="fullName"
          item-value="offenseCode"
          label="Offense Code"
          :items="statutes"
        ></ripa-autocomplete>
      </div>
    </template>

    <template v-if="reason === 2">
      <div>
        <ripa-check-group
          v-model="reasonableSuspicionValues"
          :items="reasonableSuspicionItems"
        ></ripa-check-group>
        <!-- <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Officer witnessed commission of a crime"
          value="2A"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Matched suspect description"
          value="2B"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Witness or Victim identification of Suspect at the scene"
          value="2C"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Carrying Suspicious Object"
          value="2D"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Actions indicative of casing a victim or location"
          value="2E"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Suspected of Acting as Lookout"
          value="2F"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Actions indicative of drug transaction"
          value="2G"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Actions indicative of engaging in violent crime"
          value="2H"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="reasonableSuspicion"
          dense
          label="Other Reasonable Suspicion of a crime"
          value="2I"
          hide-details
        ></v-checkbox> -->
      </div>
    </template>

    <div class="tw-mt-4 tw-mb-4 tw-font-bold">-- and --</div>

    <v-textarea
      v-model="explanation"
      auto-grow
      clearable
      clear-icon="mdi-close-circle"
      counter
      flat
      hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
      label="Brief Explanation"
      required
      rows="1"
      :rules="explanationRules"
    ></v-textarea>

    {{ getModel }}
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaHeader from '@/components/atoms/RipaHeader'

export default {
  name: 'ripa-stop-reason',

  components: {
    RipaAutocomplete,
    RipaCheckGroup,
    RipaHeader,
  },

  data() {
    return {
      valid: true,
      reason: null,
      reasonRules: [v => !!v || 'Reason is required'],
      explanation: '',
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
      ],
      items: [
        { name: 'Traffic Violation', value: 1 },
        { name: 'Reasonable Suspicion', value: 2 },
        {
          name:
            'Known to be on Parole / Probation / PRCS / Mandatory Supervision',
          value: 3,
        },
        {
          name: 'Knowledge of outstanding arrest warrant/wanted person',
          value: 4,
        },
        {
          name: 'Investigation to determine whether the person was truant',
          value: 5,
        },
        { name: 'Consensual Encounter resulting in a search', value: 6 },
      ],
      trafficViolation: null,
      trafficViolationCode: null,
      reasonableSuspicionItems: [
        { name: 'Officer witnessed commission of a crime', value: '2A' },
        { name: 'Matched suspect description', value: '2B' },
        {
          name: 'Witness or Victim identification of Suspect at the scene',
          value: '2C',
        },
        { name: 'Carrying Suspicious Object', value: '2D' },
        {
          name: 'Actions indicative of casing a victim or location',
          value: '2E',
        },
        { name: 'Suspected of Acting as Lookout', value: '2F' },
        { name: 'Actions indicative of drug transaction', value: '2G' },
        {
          name: 'Actions indicative of engaging in violent crime',
          value: '2H',
        },
        { name: 'Other Reasonable Suspicion of a crime', value: '2I' },
      ],
      reasonableSuspicionValues: [],
    }
  },

  computed: {
    getModel() {
      return {
        reason: this.reason,
        explanation: this.explanation,
        trafficViolation: this.trafficViolation,
        trafficViolationCode: this.trafficViolationCode,
        reasonableSuspicionValues: this.reasonableSuspicionValues,
      }
    },
  },

  methods: {
    submit() {
      this.$refs.stopReason.validate()
      if (!this.valid) {
        return
      }
      this.$emit('input', {
        reason: this.reason,
        explanation: this.explanation,
      })
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.v-list-item__subtitle,
.v-list-item__title {
  text-overflow: inherit;
  white-space: inherit;
}

.ripa-stop-reason {
  .v-select:not(.v-text-field--single-line):not(.v-text-field--outlined)
    .v-select__slot
    > input {
    text-overflow: ellipsis;
  }
}
</style>
