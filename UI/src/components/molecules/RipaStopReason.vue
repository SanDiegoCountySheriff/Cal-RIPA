<template>
  <div class="ripa-stop-reason tw-p-4">
    <ripa-form-header
      title="Reason for Stop"
      required
      subtitle="§999.226(a)(10)"
    ></ripa-form-header>

    <ripa-select
      v-model="model.reasonForStop"
      item-text="name"
      item-value="value"
      label="Reason"
      :items="reasonItems"
      :rules="reasonRules"
      @input="handleInput"
    ></ripa-select>

    <template v-if="model.reasonForStop === 1">
      <ripa-radio-group
        v-model="model.trafficViolation"
        :items="trafficViolationItems"
        @input="handleInput"
      ></ripa-radio-group>

      <div class="tw-mt-2"></div>

      <ripa-autocomplete
        v-model="model.trafficViolationCode"
        hint="Select 1 Offense Code (required)"
        persistent-hint
        item-text="fullName"
        item-value="code"
        label="Offense Code"
        :items="offenseCodes"
        @input="handleInput"
      ></ripa-autocomplete>
    </template>

    <template v-if="model.reasonForStop === 2">
      <ripa-check-group
        v-model="model.reasonSuspicion"
        :items="reasonableSuspicionItems"
        @input="handleInput"
      ></ripa-check-group>

      <ripa-autocomplete
        v-model="model.reasonSuspicionCode"
        hint="Select 1 Offense Code (required)"
        persistent-hint
        item-text="fullName"
        item-value="code"
        label="Offense Code"
        :items="offenseCodes"
        @input="handleInput"
      ></ripa-autocomplete>
    </template>

    <template v-if="model.reasonForStop === 6">
      <v-alert dense outlined type="warning" prominent>
        Your selection indicates that a search was conducted, please select from
        the search criteria below.
      </v-alert>

      <ripa-switch
        v-model="model.searchOfPerson"
        label="Search of person was conducted"
        :max-width="300"
        @input="handleInput"
      ></ripa-switch>

      <ripa-switch
        v-model="model.searchOfProperty"
        label="Search of property was conducted"
        :max-width="300"
        @input="handleInput"
      ></ripa-switch>
    </template>

    <ripa-label class="tw-mt-4 tw-mb-6" value="-- and --" bold></ripa-label>

    <ripa-text-area
      v-model="model.reasonForStopExplanation"
      hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
      persistent-hint
      label="Brief Explanation"
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
import RipaSwitch from '@/components/atoms/RipaSwitch'
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
    RipaSwitch,
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
        reasonForStop: this.value?.reasonForStop || null,
        trafficViolation: this.value?.trafficViolation || null,
        trafficViolationCode: this.value?.trafficViolationCode || null,
        reasonSuspicion: this.value?.reasonSuspicion || [],
        reasonSuspicionCode: this.value?.reasonSuspicionCode || null,
        searchOfPerson: this.value?.searchOfPerson || null,
        searchOfProperty: this.value?.searchOfProperty || null,
        reasonForStopExplanation: this.value?.reasonForStopExplanation || null,
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
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    offenseCodes: {
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
