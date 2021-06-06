<template>
  <div class="ripa-action-taken tw-pb-4">
    <ripa-form-header
      title="Result of Stop"
      required
      subtitle="§999.226(a)(13)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" class="tw-pr-2">
          <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
            <v-btn class="tw-w-full" outlined small @click="onOpenFavorites">
              Open Favorites
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
            <v-btn class="tw-w-full" outlined small @click="handleSaveFavorite">
              Save Result
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12" class="tw-mb-4"> </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.stopResult.anyActionsTaken"
            label="Any Actions Taken?"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.stopResult.anyActionsTaken">
            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop2"
              label="Warning (verbal or written)"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop2">
              <ripa-autocomplete
                v-model="model.stopResult.warningCodes"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                :items="statutes"
                multiple
                chips
                small-chips
                deletable-chips
                :max-selections="5"
                :rules="warningRules"
                @input="handleInput"
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeWarningVisible">
                <div class="tw-mt-4 tw-text-content">
                  <v-btn
                    x-small
                    outlined
                    color="primary"
                    @click="handlePullReasonCodeWarning"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop3"
              label="Citation for infraction"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop3">
              <ripa-autocomplete
                v-model="model.stopResult.citationCodes"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                :items="statutes"
                multiple
                chips
                small-chips
                deletable-chips
                :max-selections="5"
                :rules="citationRules"
                @input="handleInput"
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCitationVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    x-small
                    outlined
                    color="primary"
                    @click="handlePullReasonCodeCitation"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop4"
              label="In-field cite and release"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop4">
              <ripa-autocomplete
                v-model="model.stopResult.infieldCodes"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                :items="statutes"
                multiple
                chips
                small-chips
                deletable-chips
                :max-selections="5"
                :rules="infieldRules"
                @input="handleInput"
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeInfieldVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    x-small
                    outlined
                    color="primary"
                    @click="handlePullReasonCodeInfield"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop5"
              label="Custodial arrest pursurant to outstanding warrant"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop6"
              label="Custodial arrest without warrant"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop6">
              <ripa-autocomplete
                v-model="model.stopResult.custodialArrestCodes"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                :items="statutes"
                multiple
                chips
                small-chips
                deletable-chips
                :max-selections="5"
                :rules="custodialArrestRules"
                @input="handleInput"
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCustodialArrestVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    x-small
                    outlined
                    color="primary"
                    @click="handlePullReasonCodeCustodialArrest"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop7"
              label="Field interview card completed"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop8"
              label="Noncriminal transport or caretaking transport"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop9"
              label="Contacted parent/legal guardian or other person responsible for the minor"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop10"
              label="Psychiatric hold"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop11"
              label="Contacted U.S. Department of Homeland Security"
              :rules="actionsTakenRules"
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop11">
              <ripa-alert class="tw-mt-8" alert-outlined alert-type="error">
                Are you sure you want to select 'Contacted U.S. Department of
                Homeland Security?'
              </ripa-alert>
            </template>

            <template v-if="model.person.isStudent">
              <ripa-checkbox
                v-model="model.stopResult.actionsTakenDuringStop12"
                label="Referral to school administrator"
                :rules="actionsTakenRules"
                hide-details
                @input="handleInput"
              ></ripa-checkbox>
              <ripa-checkbox
                v-model="model.stopResult.actionsTakenDuringStop13"
                label="Referral to school counselor or other support staff"
                :rules="actionsTakenRules"
                hide-details
                @input="handleInput"
              ></ripa-checkbox>
            </template>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { STOP_RESULTS } from '@/constants/form'

export default {
  name: 'ripa-stop-result',

  mixins: [RipaModelMixin],

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaCheckbox,
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      stopResultItems: STOP_RESULTS,
      viewModel: this.updateModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    isHomelandSecuritySelected() {
      return this.viewModel.stopResult.actionsTakenDuringStop10
    },

    isPullReasonCodeValid() {
      const reasonForStop = this.viewModel.stopReason?.reasonForStop || []
      return [1, 2, 3, 5].includes(reasonForStop)
    },

    isPullReasonCodeWarningVisible() {
      const codes = this.viewModel.stopResult?.warningCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeCitationVisible() {
      const codes = this.viewModel.stopResult?.citationCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeInfieldVisible() {
      const codes = this.viewModel.stopResult?.infieldCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeCustodialArrestVisible() {
      const codes = this.viewModel.stopResult?.custodialArrestCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    actionsTakenRules() {
      const checked = this.viewModel.stopResult.anyActionsTaken
      const value2 = this.viewModel.stopResult.actionsTakenDuringStop2
      const value3 = this.viewModel.stopResult.actionsTakenDuringStop3
      const value4 = this.viewModel.stopResult.actionsTakenDuringStop4
      const value5 = this.viewModel.stopResult.actionsTakenDuringStop5
      const value6 = this.viewModel.stopResult.actionsTakenDuringStop6
      const value7 = this.viewModel.stopResult.actionsTakenDuringStop7
      const value8 = this.viewModel.stopResult.actionsTakenDuringStop8
      const value9 = this.viewModel.stopResult.actionsTakenDuringStop9
      const value10 = this.viewModel.stopResult.actionsTakenDuringStop10
      const value11 = this.viewModel.stopResult.actionsTakenDuringStop11
      const value12 = this.viewModel.stopResult.actionsTakenDuringStop12
      const value13 = this.viewModel.stopResult.actionsTakenDuringStop13

      return [
        (checked &&
          (value2 ||
            value3 ||
            value4 ||
            value5 ||
            value6 ||
            value7 ||
            value8 ||
            value9 ||
            value10 ||
            value11 ||
            value12 ||
            value13)) ||
          'An action taken is required',
      ]
    },

    warningRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop2
      const options = this.viewModel.stopResult.warningCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    citationRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop3
      const options = this.viewModel.stopResult.citationCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    infieldRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop4
      const options = this.viewModel.stopResult.infieldCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    custodialArrestRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop6
      const options = this.viewModel.stopResult.custodialArrestCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },
  },

  methods: {
    handleInput() {
      this.updateStopResultActionsTakenModel()
      this.updateStopResultWarningCodesModel()
      this.updateStopResultCitationCodesModel()
      this.updateStopResultInfieldCodesModel()
      this.updateStopResultCustodiaArrestCodesModel()
      this.$emit('input', this.viewModel)
    },

    getReasonCode() {
      const trafficViolationCode =
        this.viewModel.stopReason?.trafficViolationCode || null
      const reasonableSuspicionCode =
        this.viewModel.stopReason?.reasonableSuspicionCode || null

      if (trafficViolationCode) {
        return trafficViolationCode
      }

      if (reasonableSuspicionCode) {
        return reasonableSuspicionCode
      }

      return null
    },

    handlePullReasonCodeWarning() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.pullFromReasonCode = true
        this.viewModel.stopResult.warningCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCitation() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.pullFromReasonCode = true
        this.viewModel.stopResult.citationCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeInfield() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.pullFromReasonCode = true
        this.viewModel.stopResult.infieldCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCustodialArrest() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.pullFromReasonCode = true
        this.viewModel.stopResult.custodialArrestCodes.push(reasonCode)
      }
    },

    handleSaveFavorite() {
      if (this.onSaveFavorite) {
        this.onSaveFavorite(this.viewModel.stopResult)
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
    },

    lastResult(newVal) {
      if (newVal) {
        this.viewModel.stopResult = newVal
        this.handleInput()
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    lastResult: {
      type: Object,
      default: () => {},
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    onOpenFavorites: {
      type: Function,
      default: () => {},
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
