<template>
  <div class="ripa-stop-reason tw-pb-4">
    <ripa-form-header
      title="Reason for Stop"
      required
      subtitle="§999.226(a)(10)"
      v-on="$listeners"
    ></ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="6" md="6" class="tw-pr-2">
          <div class="tw-mr-2 tw-mt-4">
            <v-btn
              class="tw-w-full"
              color="primary"
              small
              @click="handleOpenFavorites"
            >
              Open Favorites
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <template v-if="isOnlineAndAuthenticated">
            <div class="tw-mr-2 tw-mt-4">
              <v-btn
                class="tw-w-full"
                color="primary"
                small
                @click="handleSaveFavorite"
              >
                Save Reason
              </v-btn>
            </div>
          </template>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12" class="tw-mb-4"> </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-select
            v-model="model.stopReason.reasonForStop"
            item-text="name"
            item-value="value"
            label="Reason"
            :items="getReasonItems"
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
            <ripa-alert alert-outlined alert-type="warning">
              Your selection indicates that a search was conducted, please
              select from the search criteria below.
            </ripa-alert>

            <ripa-switch
              v-model="model.stopReason.searchOfPerson"
              label="Search of person was conducted"
              :max-width="300"
              @input="handleInput"
              :rules="searchRules"
            ></ripa-switch>

            <ripa-switch
              v-model="model.stopReason.searchOfProperty"
              label="Search of property was conducted"
              :max-width="300"
              @input="handleInput"
              :rules="searchRules"
            ></ripa-switch>
          </template>

          <ripa-subheader text="-- and --"></ripa-subheader>

          <template v-if="model.stopReason.reasonForStopPiiFound">
            <ripa-alert alert-outlined alert-type="warning">
              The explanation contains personally identifying information.
              Please remove if possible.
            </ripa-alert>
          </template>

          <ripa-text-input
            v-model="model.stopReason.reasonForStopExplanation"
            hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
            persistent-hint
            label="Brief Explanation"
            :loading="loadingPiiStep3"
            :rules="explanationRules"
            @input="handleInput($event), handlePiiCheck($event)"
          ></ripa-text-input>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import {
  STOP_REASONS,
  EDUCATION_VIOLATIONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  EDUCATION_CODE_SECTIONS,
} from '@/constants/form'

export default {
  name: 'ripa-stop-reason',

  mixins: [RipaModelMixin],

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaCheckGroup,
    RipaFormHeader,
    RipaRadioGroup,
    RipaSelect,
    RipaSubheader,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      reasonRules: [v => !!v || 'Stop reason is required'],
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ],
      reasonItems: STOP_REASONS,
      educationCodeSectionItems: EDUCATION_CODE_SECTIONS,
      educationViolationItems: EDUCATION_VIOLATIONS,
      trafficViolationItems: TRAFFIC_VIOLATIONS,
      reasonableSuspicionItems: REASONABLE_SUSPICIONS,
      viewModel: this.syncModel(this.value),
    }
  },

  inject: [
    'isOnlineAndAuthenticated',
    'lastReason',
    'loadingPiiStep3',
    'statutes',
  ],

  created() {
    if (this.viewModel.stopReason.reasonForStopExplanation) {
      this.handlePiiCheck(this.viewModel.stopReason.reasonForStopExplanation)
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    getReasonItems() {
      if (this.viewModel.person.isStudent) {
        return this.reasonItems
      }

      return this.reasonItems.filter(
        item => item.value !== 7 && item.value !== 8,
      )
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
        (checked1 && checked2 && code !== null) ||
          'An offense code is required',
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
      return [(checked && code !== null) || 'An offense code is required']
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

    searchRules() {
      const checked = this.viewModel.stopReason.reasonForStop === 6
      const checkedPerson = this.viewModel.stopReason.searchOfPerson
      const checkedProperty = this.viewModel.stopReason.searchOfProperty
      if (checked) {
        return [
          checkedPerson ||
            checkedProperty ||
            'Your selection indicates that a search was conducted, please select from the search criteria below.',
        ]
      }

      return []
    },
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.viewModel)
    },

    handleOpenFavorites() {
      this.$emit('on-open-reason-favorites')
    },

    handleSaveFavorite() {
      this.$emit('on-save-reason-favorite', this.viewModel.stopReason)
    },

    handlePiiCheck(textValue) {
      this.$emit('pii-check', { source: 'reason', value: textValue })
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
    },

    lastReason(newVal) {
      if (newVal) {
        this.viewModel.stopReason = newVal
        this.handleInput()
      }
    },
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
