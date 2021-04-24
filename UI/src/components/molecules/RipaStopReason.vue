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
import {
  STOP_REASONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
} from '@/constants/form'

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
      reasonItems: STOP_REASONS,
      trafficViolationItems: TRAFFIC_VIOLATIONS,
      reasonableSuspicionItems: REASONABLE_SUSPICIONS,
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
