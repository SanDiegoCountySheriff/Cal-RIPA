<template>
  <div class="ripa-action-taken tw-pb-8">
    <ripa-form-header
      title="Result of Stop"
      required
      subtitle="§999.226(a)(13)"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.stopResult.anyActionsTaken"
            label="Any Actions Taken?"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.stopResult.anyActionsTaken">
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

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop1"
              label="Warning (verbal or written)"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop1">
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
              v-model="model.stopResult.actionsTakenDuringStop2"
              label="Citation for infraction"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop2">
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
              v-model="model.stopResult.actionsTakenDuringStop3"
              label="In-field cite and release"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop3">
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
              v-model="model.stopResult.actionsTakenDuringStop4"
              label="Custodial arrest pursurant to outstanding warrant"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop5"
              label="Custodial arrest without warrant"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop5">
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
              v-model="model.stopResult.actionsTakenDuringStop6"
              label="Field interview card completed"
              :rules="actionsTakenRules"
              hide-details
              @input="handleInput"
            ></ripa-checkbox>

            <ripa-checkbox
              v-model="model.stopResult.actionsTakenDuringStop7"
              label="Psychiatric hold"
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
              label="Contacted U.S. Department of Homeland Security"
              :rules="actionsTakenRules"
              @input="handleInput"
            ></ripa-checkbox>

            <template v-if="model.stopResult.actionsTakenDuringStop10">
              <ripa-alert class="tw-mt-8" alert-outlined alert-type="error">
                Are you sure you want to select 'Contacted U.S. Department of
                Homeland Security?'
              </ripa-alert>
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { STOP_RESULTS } from '@/constants/form'

export default {
  name: 'ripa-stop-result',

  mixins: [RipaFormMixin],

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaCheckbox,
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      stopResultItems: STOP_RESULTS,
      viewModel: this.loadModel(this.value),
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
      const value1 = this.viewModel.stopResult.actionsTakenDuringStop1
      const value2 = this.viewModel.stopResult.actionsTakenDuringStop2
      const value3 = this.viewModel.stopResult.actionsTakenDuringStop3
      const value4 = this.viewModel.stopResult.actionsTakenDuringStop4
      const value5 = this.viewModel.stopResult.actionsTakenDuringStop5
      const value6 = this.viewModel.stopResult.actionsTakenDuringStop6
      const value7 = this.viewModel.stopResult.actionsTakenDuringStop7
      const value8 = this.viewModel.stopResult.actionsTakenDuringStop8
      const value9 = this.viewModel.stopResult.actionsTakenDuringStop9
      const value10 = this.viewModel.stopResult.actionsTakenDuringStop10
      const value12 = this.viewModel.stopResult.actionsTakenDuringStop12
      const value13 = this.viewModel.stopResult.actionsTakenDuringStop13
      return [
        (checked &&
          (value1 ||
            value2 ||
            value3 ||
            value4 ||
            value5 ||
            value6 ||
            value7 ||
            value8 ||
            value9 ||
            value10 ||
            value12 ||
            value13)) ||
          'An action taken is required',
      ]
    },

    warningRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop1
      const options = this.viewModel.stopResult.warningCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    citationRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop2
      const options = this.viewModel.stopResult.citationCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    infieldRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop3
      const options = this.viewModel.stopResult.infieldCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    custodialArrestRules() {
      const checked1 = this.viewModel.stopResult.anyActionsTaken
      const checked2 = this.viewModel.stopResult.actionsTakenDuringStop5
      const options = this.viewModel.stopResult.custodialArrestCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },
  },

  methods: {
    handleInput() {
      this.updateActionsTakenModel()
      this.updateWarningCodesModel()
      this.updateCitationCodesModel()
      this.updateInfieldCodesModel()
      this.updateCustodiaArrestCodesModel()
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
        this.viewModel.stopResult.warningCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCitation() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.citationCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeInfield() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.infieldCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCustodialArrest() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.viewModel.stopResult.custodialArrestCodes.push(reasonCode)
      }
    },

    updateActionsTakenModel() {
      if (!this.viewModel.stopResult.anyActionsTaken) {
        this.viewModel.stopResult.actionsTakenDuringStop1 = false
        this.viewModel.stopResult.actionsTakenDuringStop2 = false
        this.viewModel.stopResult.actionsTakenDuringStop3 = false
        this.viewModel.stopResult.actionsTakenDuringStop4 = false
        this.viewModel.stopResult.actionsTakenDuringStop5 = false
        this.viewModel.stopResult.actionsTakenDuringStop6 = false
        this.viewModel.stopResult.actionsTakenDuringStop7 = false
        this.viewModel.stopResult.actionsTakenDuringStop8 = false
        this.viewModel.stopResult.actionsTakenDuringStop9 = false
        this.viewModel.stopResult.actionsTakenDuringStop10 = false
        this.viewModel.stopResult.actionsTakenDuringStop12 = false
        this.viewModel.stopResult.actionsTakenDuringStop13 = false
      }
    },

    updateWarningCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop1) {
        this.viewModel.stopResult.warningCodes = null
      }
    },

    updateCitationCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop2) {
        this.viewModel.stopResult.citationCodes = null
      }
    },

    updateInfieldCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop3) {
        this.viewModel.stopResult.infieldCodes = null
      }
    },

    updateCustodiaArrestCodesModel() {
      if (!this.viewModel.stopResult.actionsTakenDuringStop5) {
        this.viewModel.stopResult.custodialArrestCodes = null
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
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
