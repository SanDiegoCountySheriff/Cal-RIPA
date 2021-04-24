<template>
  <div class="ripa-stop-reason tw-p-4">
    <ripa-form-header
      title="Reason for Stop"
      required
      subtitle="§999.226(a)(10)"
    ></ripa-form-header>

    <ripa-select
      v-model="model.reason"
      item-text="name"
      item-value="value"
      label="Reason"
      :items="reasonItems"
      :rules="reasonRules"
      @input="handleInput"
    ></ripa-select>

    <template v-if="model.reason === 1">
      <div>
        <ripa-radio-group
          v-model="model.trafficViolation"
          :items="trafficViolationItems"
          @input="handleInput"
        ></ripa-radio-group>

        <div class="tw-mt-2"></div>

        <ripa-autocomplete
          v-model="model.trafficViolationCode"
          hint="Select 1 Offense Code (required)"
          item-text="fullName"
          item-value="offenseCode"
          label="Offense Code"
          :items="statutes"
          @input="handleInput"
        ></ripa-autocomplete>
      </div>
    </template>

    <template v-if="model.reason === 2">
      <div>
        <ripa-check-group
          v-model="model.reasonableSuspicionValues"
          :items="reasonableSuspicionItems"
          @input="handleInput"
        ></ripa-check-group>
      </div>
    </template>

    <ripa-label class="tw-mt-4 tw-mb-6" value="-- and --" bold></ripa-label>

    <ripa-text-area
      v-model="model.explanation"
      hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
      label="Brif Explanation"
      :rules="explanationRules"
      @input="handleInput"
    ></ripa-text-area>
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaLabel from '@/components/atoms/RipaLabel'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaTextArea from '@/components/atoms/RipaTextArea'

export default {
  name: 'ripa-stop-reason',

  components: {
    RipaAutocomplete,
    RipaCheckGroup,
    RipaFormHeader,
    RipaLabel,
    RipaRadioGroup,
    RipaSelect,
    RipaTextArea,
  },

  data() {
    return {
      valid: true,
      reasonRules: [v => !!v || 'Reason is required'],
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
      trafficViolationItems: [
        { name: 'Moving Violation', value: '1A' },
        { name: 'Equipment Violation', value: '1B' },
        {
          name: 'Non-moving Violation, including Registration Violation',
          value: '1C',
        },
      ],
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
      viewModel: {
        reason: this.value?.reason || null,
        explanation: this.value?.explanation || null,
        trafficViolation: this.value?.trafficViolation || null,
        trafficViolationCode: this.value?.trafficViolationCode || null,
        reasonableSuspicionValues: this.value?.reasonableSuspicionValues || [],
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      if (this.viewModel.reason === 1) {
        this.viewModel.reasonableSuspicionValues = []
      }
      if (this.viewModel.reason === 2) {
        this.viewModel.trafficViolation = null
        this.viewModel.trafficViolationCode = null
      }
      this.$emit('input', this.viewModel)
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
