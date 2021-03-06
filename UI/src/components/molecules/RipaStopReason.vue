<template>
  <div class="ripa-stop-reason tw-pb-8">
    {{ viewModel.stopReason }}
    <ripa-form-header
      title="Reason for Stop"
      required
      subtitle="§999.226(a)(10)"
    ></ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-select
            v-model="model.stopReason.reasonForStop"
            item-text="name"
            item-value="value"
            label="Reason"
            :items="reasonItems"
            :rules="reasonRules"
            @input="handleInput"
          ></ripa-select>

          <template v-if="model.stopReason.reasonForStop === 7">
            <ripa-radio-group
              v-model="model.stopReason.educationViolation"
              :items="educationViolationItems"
              :rules="educationViolationRules"
              @input="handleInput"
            ></ripa-radio-group>

            <template v-if="model.stopReason.educationViolation === 1">
              <div class="tw-mt-2"></div>

              <ripa-autocomplete
                v-model="model.stopReason.educationViolationCode"
                hint="Select 1 Education Code (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Education Code"
                :items="educationCodeSectionItems"
                :rules="educationViolationCodeRules"
                @input="handleInput"
              ></ripa-autocomplete>
            </template>
          </template>

          <template v-if="model.stopReason.reasonForStop === 1">
            <ripa-radio-group
              v-model="model.stopReason.trafficViolation"
              :items="trafficViolationItems"
              :rules="trafficViolationRules"
              @input="handleInput"
            ></ripa-radio-group>

            <div class="tw-mt-2"></div>

            <ripa-autocomplete
              v-model="model.stopReason.trafficViolationCode"
              hint="Select 1 Offense Code (required)"
              persistent-hint
              item-text="fullName"
              item-value="code"
              label="Offense Code"
              :items="statutes"
              :rules="trafficViolationCodeRules"
              @input="handleInput"
            ></ripa-autocomplete>
          </template>

          <template v-if="model.stopReason.reasonForStop === 2">
            <ripa-check-group
              v-model="model.stopReason.reasonableSuspicion"
              :items="reasonableSuspicionItems"
              :rules="reasonableSuspicionRules"
              @input="handleInput"
            ></ripa-check-group>

            <ripa-autocomplete
              v-model="model.stopReason.reasonableSuspicionCode"
              hint="Select 1 Offense Code (required)"
              persistent-hint
              item-text="fullName"
              item-value="code"
              label="Offense Code"
              :items="statutes"
              :rules="reasonableSuspicionCodeRules"
              @input="handleInput"
            ></ripa-autocomplete>
          </template>

          <template v-if="model.stopReason.reasonForStop === 6">
            <v-alert dense outlined type="warning" prominent>
              Your selection indicates that a search was conducted, please
              select from the search criteria below.
            </v-alert>

            <ripa-switch
              v-model="model.stopReason.searchOfPerson"
              label="Search of person was conducted"
              :max-width="300"
              @input="handleInput"
            ></ripa-switch>

            <ripa-switch
              v-model="model.stopReason.searchOfProperty"
              label="Search of property was conducted"
              :max-width="300"
              @input="handleInput"
            ></ripa-switch>
          </template>

          <ripa-subheader text="-- and --"></ripa-subheader>

          <template v-if="model.stopReason.reasonForStopPiiFound">
            <v-alert outlined type="warning" dense>
              The explanation contains personally identifying information.
              Please remove if possible.
            </v-alert>
          </template>

          <ripa-text-area
            v-model="model.stopReason.reasonForStopExplanation"
            hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
            persistent-hint
            label="Brief Explanation"
            :loading="loadingPii"
            :rules="explanationRules"
            @input="handleInput"
          ></ripa-text-area>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextArea from '@/components/atoms/RipaTextArea'
import {
  STOP_REASONS,
  EDUCATION_VIOLATIONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  EDUCATION_CODE_SECTIONS,
} from '@/constants/form'

export default {
  name: 'ripa-stop-reason',

  mixins: [RipaFormMixin],

  components: {
    RipaAutocomplete,
    RipaCheckGroup,
    RipaFormHeader,
    RipaRadioGroup,
    RipaSelect,
    RipaSubheader,
    RipaSwitch,
    RipaTextArea,
  },

  data() {
    return {
      valid: true,
      reasonRules: [v => !!v || 'Stop reason is required'],
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
      ],
      reasonItems: STOP_REASONS,
      educationCodeSectionItems: EDUCATION_CODE_SECTIONS,
      educationViolationItems: EDUCATION_VIOLATIONS,
      trafficViolationItems: TRAFFIC_VIOLATIONS,
      reasonableSuspicionItems: REASONABLE_SUSPICIONS,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    educationViolationRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 7
      const options = this.viewModel.stopReason.educationViolation
      return [
        (checked && options !== null) ||
          'An education violation type is required',
      ]
    },

    educationViolationCodeRules() {
      const checked1 = this.viewModel.stopReason.reasonForStop === 7
      const checked2 = this.viewModel.stopReason.educationViolation === 1
      const code = this.viewModel.stopReason.educationViolationCode
      return [
        (checked1 && checked2 && code !== null) || 'A offense code is required',
      ]
    },

    trafficViolationRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 1
      const options = this.viewModel.stopReason.trafficViolation
      return [
        (checked && options !== null) || 'A traffic violation type is required',
      ]
    },

    trafficViolationCodeRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 1
      const code = this.viewModel.stopReason.trafficViolationCode
      return [(checked && code !== null) || 'A offense code is required']
    },

    reasonableSuspicionRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 2
      const options = this.viewModel.stopReason.reasonableSuspicion
      return [
        (checked && options !== null && options.length > 0) ||
          'A reasonable suspicion type is required',
      ]
    },

    reasonableSuspicionCodeRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 2
      const code = this.viewModel.stopReason.reasonableSuspicionCode
      return [(checked && code !== null) || 'An offense code is required']
    },
  },

  methods: {
    handleInput() {
      this.updateSearchModel()
      this.$emit('input', this.viewModel)
    },

    updateSearchModel() {
      if (this.viewModel.stopReason.reasonForStop !== 6) {
        this.viewModel.stopReason.searchOfPerson = false
        this.viewModel.stopReason.searchOfProperty = false
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
    },

    'value.stopReason.reasonForStopPiiFound': {
      handler(newVal) {
        this.viewModel.stopReason.reasonForStopPiiFound = newVal
      },
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    loadingPii: {
      type: Boolean,
      default: false,
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
