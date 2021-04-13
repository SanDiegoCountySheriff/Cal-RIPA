<template>
  <div class="ripa-stop-reason tw-p-4">
    <ripa-form-header
      title="Reason for Stop"
      required
      subtitle="ABC123"
    ></ripa-form-header>

    <ripa-date-picker
      v-model="datePicker"
      label="Date of Stop"
    ></ripa-date-picker>

    <ripa-time-picker
      v-model="timePicker"
      label="Time of Stop"
    ></ripa-time-picker>

    <ripa-select
      v-model="reason"
      item-text="name"
      item-value="value"
      label="Reason"
      :items="reasonItems"
      :rules="reasonRules"
    ></ripa-select>

    <template v-if="reason === 1">
      <div>
        <ripa-radio-group
          v-model="trafficViolation"
          :items="trafficViolationItems"
        ></ripa-radio-group>

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
      </div>
    </template>

    <div class="tw-mt-4 tw-mb-4 tw-font-bold">-- and --</div>

    <ripa-text-area
      v-model="explanation"
      hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
      label="Brif Explanation"
      :rules="explanationRules"
    ></ripa-text-area>

    {{ getModel }}
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaTextArea from '@/components/atoms/RipaTextArea'
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import { format } from 'date-fns'

export default {
  name: 'ripa-stop-reason',

  components: {
    RipaAutocomplete,
    RipaCheckGroup,
    RipaFormHeader,
    RipaRadioGroup,
    RipaSelect,
    RipaTextArea,
    RipaDatePicker,
    RipaTimePicker,
  },

  data() {
    return {
      valid: true,
      numberInputValue: null,
      reason: null,
      reasonRules: [v => !!v || 'Reason is required'],
      explanation: '',
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
      ],
      reasonItems: [
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
      trafficViolationItems: [
        { name: 'Moving Violation', value: '1A' },
        { name: 'Equipment Violation', value: '1B' },
        {
          name: 'Non-moving Violation, including Registration Violation',
          value: '1C',
        },
      ],
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
      datePicker: format(new Date(), 'yyyy-MM-dd'),
      timePicker: format(new Date(), 'h:mm'),
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
        datePicker: this.datePicker,
        timePicker: this.timePicker,
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
