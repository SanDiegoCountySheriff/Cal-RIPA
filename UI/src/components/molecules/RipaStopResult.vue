<template>
  <div class="ripa-action-taken tw-pb-4">
    <ripa-form-header
      title="Result of Stop"
      required
      :subtitle="
        model.stopVersion === 1 ? '§999.226(a)(13)' : '§999.226(a)(18)'
      "
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="6" md="6" class="tw-pr-2">
          <div class="tw-mr-2 tw-mt-4">
            <v-btn
              @click="handleOpenFavorites"
              class="tw-w-full"
              color="primary"
              small
            >
              Open Favorites
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <template v-if="isOnlineAndAuthenticated">
            <div class="tw-mr-2 tw-mt-4">
              <v-btn
                @click="handleSaveFavorite"
                class="tw-w-full"
                color="primary"
                small
              >
                Save Result
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
          <ripa-switch
            v-model="model.stopResult.anyResultsOfStop"
            :max-width="200"
            label="Any Results of Stop?"
            @input="handleUpdateModel"
          ></ripa-switch>

          <template v-if="model.stopResult.anyResultsOfStop">
            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop2"
              :rules="actionsTakenRules"
              @input="handleUpdateModel"
              label="Warning (verbal or written)"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop2"
              :rules="actionsTakenRulesV2"
              @input="handleUpdateModelV2"
              label="Verbal Warning"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop2 && model.stopVersion === 1"
            >
              <ripa-autocomplete
                v-model="model.stopResult.warningCodes"
                :items="statutes"
                :max-selections="5"
                :rules="warningRules"
                @remove-item="removeItem('warningCodes', $event)"
                @input="handleUpdateModel"
                hint="Select Up To 5 Offense Codes (required)"
                persistent-hint
                label="Offense Code"
                item-text="fullName"
                item-value="code"
                multiple
                custom-chip
              >
              </ripa-autocomplete>
              <template v-if="isPullReasonCodeWarningVisible">
                <div class="tw-mt-4 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeWarningDisabled"
                    @click="handlePullReasonCodeWarning"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <template
              v-else-if="
                model.stopResult.resultsOfStop2 && model.stopVersion === 2
              "
            >
              <ripa-autocomplete
                v-model="model.stopResult.verbalWarningCodes"
                :items="statutes"
                :max-selections="5"
                :rules="verbalWarningRulesV2"
                @remove-item="removeItem('verbalWarningCodes', $event)"
                @input="handleUpdateModelV2"
                hint="Select Up To 5 Offense Codes (required)"
                persistent-hint
                label="Offense Code"
                item-text="fullName"
                item-value="code"
                multiple
                custom-chip
              >
              </ripa-autocomplete>
              <template v-if="isPullReasonCodeVerbalWarningVisible">
                <div class="tw-mt-4 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeVerbalWarningDisabled"
                    @click="handlePullReasonCodeVerbalWarning"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop3"
              :rules="actionsTakenRules"
              @input="handleUpdateModel"
              label="Citation for infraction"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-else-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop3"
              :rules="actionsTakenRulesV2"
              @input="handleUpdateModelV2"
              label="Written Warning"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop3 && model.stopVersion === 1"
            >
              <ripa-autocomplete
                v-model="model.stopResult.citationCodes"
                :items="statutes"
                :max-selections="5"
                :rules="citationRules"
                @remove-item="removeItem('citationCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCitationVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeCitationDisabled"
                    @click="handlePullReasonCodeCitation"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <template
              v-else-if="
                model.stopResult.resultsOfStop3 && model.stopVersion === 2
              "
            >
              <ripa-autocomplete
                v-model="model.stopResult.writtenWarningCodes"
                :items="statutes"
                :max-selections="5"
                :rules="writtenWarningRulesV2"
                @remove-item="removeItem('writtenWarningCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeWrittenWarningVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeWrittenWarningDisabled"
                    @click="handlePullReasonCodeWrittenWarning"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop4"
              :rules="actionsTakenRules"
              @input="handleUpdateModel"
              label="In-field cite and release"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-else-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop4"
              :rules="actionsTakenRulesV2"
              @input="handleUpdateModelV2"
              label="Citation for infraction"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop4 && model.stopVersion === 1"
            >
              <ripa-autocomplete
                v-model="model.stopResult.infieldCodes"
                :items="statutes"
                :max-selections="5"
                :rules="infieldRules"
                @remove-item="removeItem('infieldCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeInfieldVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeInfieldDisable"
                    @click="handlePullReasonCodeInfield"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <template
              v-else-if="
                model.stopResult.resultsOfStop4 && model.stopVersion === 2
              "
            >
              <ripa-autocomplete
                v-model="model.stopResult.citationCodes"
                :items="statutes"
                :max-selections="5"
                :rules="citationRulesV2"
                @remove-item="removeItem('citationCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCitationVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeCitationDisabled"
                    @click="handlePullReasonCodeCitation"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop5"
              :rules="actionsTakenRules"
              label="Custodial arrest pursuant to outstanding warrant"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-else-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop5"
              :rules="actionsTakenRulesV2"
              label="In-field cite and release"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop5 && model.stopVersion === 2"
            >
              <ripa-autocomplete
                v-model="model.stopResult.infieldCodes"
                :items="statutes"
                :max-selections="5"
                :rules="infieldRulesV2"
                @remove-item="removeItem('infieldCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeInfieldVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeInfieldDisable"
                    @click="handlePullReasonCodeInfield"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop6"
              :rules="actionsTakenRules"
              @input="handleUpdateModel"
              label="Custodial arrest without warrant"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-else-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop6"
              :rules="actionsTakenRulesV2"
              label="Custodial arrest pursuant to outstanding warrant"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop6 && model.stopVersion === 1"
            >
              <ripa-autocomplete
                v-model="model.stopResult.custodialArrestCodes"
                :items="statutes"
                :max-selections="5"
                :rules="custodialArrestRules"
                @remove-item="removeItem('custodialArrestCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCustodialArrestVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeCustodialArrestDisabled"
                    @click="handlePullReasonCodeCustodialArrest"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop7"
              :rules="actionsTakenRules"
              label="Field interview card completed"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-else-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop7"
              :rules="actionsTakenRules"
              @input="handleUpdateModelV2"
              label="Custodial arrest without warrant"
              hide-details
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop7 && model.stopVersion === 2"
            >
              <ripa-autocomplete
                v-model="model.stopResult.custodialArrestCodes"
                :items="statutes"
                :max-selections="5"
                :rules="custodialArrestRulesV2"
                @remove-item="removeItem('custodialArrestCodes', $event)"
                hint="Select Up to 5 Offense Codes (required)"
                persistent-hint
                item-text="fullName"
                item-value="code"
                label="Offense Code"
                multiple
                custom-chip
              ></ripa-autocomplete>
              <template v-if="isPullReasonCodeCustodialArrestVisible">
                <div class="tw-mt-2 tw-text-content">
                  <v-btn
                    :disabled="isPullReasonCodeCustodialArrestDisabled"
                    @click="handlePullReasonCodeCustodialArrest"
                    x-small
                    outlined
                    color="primary"
                  >
                    Pull from Reason Code
                  </v-btn>
                </div>
              </template>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop8"
              :rules="actionsTakenRules"
              label="Noncriminal transport or caretaking transport"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop8"
              :rules="actionsTakenRulesV2"
              label="Field interview card completed"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop9"
              :rules="actionsTakenRules"
              label="Contacted parent/legal guardian or other person responsible for the minor"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop9"
              :rules="actionsTakenRulesV2"
              label="Noncriminal transport or caretaking transport"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop10"
              :rules="actionsTakenRules"
              label="Psychiatric hold"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop10"
              :rules="actionsTakenRulesV2"
              label="Contacted parent/legal guardian or other person responsible for the minor"
              hide-details
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop11"
              :rules="actionsTakenRulesV2"
              label="Psychiatric hold"
              hide-details
            ></ripa-checkbox>

            <template v-if="model.person.isStudent && model.stopVersion === 1">
              <ripa-checkbox
                v-model="model.stopResult.resultsOfStop12"
                :rules="actionsTakenRules"
                label="Referral to school administrator"
                hide-details
              ></ripa-checkbox>
              <ripa-checkbox
                v-model="model.stopResult.resultsOfStop13"
                :rules="actionsTakenRules"
                label="Referral to school counselor or other support staff"
                hide-details
              ></ripa-checkbox>
            </template>

            <template v-if="model.person.isStudent && model.stopVersion === 2">
              <ripa-checkbox
                v-model="model.stopResult.resultsOfStop13"
                :rules="actionsTakenRulesV2"
                label="Referral to school administrator"
                hide-details
              ></ripa-checkbox>
              <ripa-checkbox
                v-model="model.stopResult.resultsOfStop14"
                :rules="actionsTakenRulesV2"
                label="Referral to school counselor or other support staff"
                hide-details
              ></ripa-checkbox>
            </template>

            <ripa-checkbox
              v-if="model.stopVersion === 1"
              v-model="model.stopResult.resultsOfStop11"
              :rules="actionsTakenRules"
              label="Contacted U.S. Department of Homeland Security"
            ></ripa-checkbox>

            <ripa-checkbox
              v-if="model.stopVersion === 2"
              v-model="model.stopResult.resultsOfStop12"
              :rules="actionsTakenRulesV2"
              label="Contacted U.S. Department of Homeland Security"
            ></ripa-checkbox>

            <template
              v-if="model.stopResult.resultsOfStop11 && model.stopVersion === 1"
            >
              <ripa-alert class="tw-mt-8" alert-outlined alert-type="error">
                Are you sure you want to select 'Contacted U.S. Department of
                Homeland Security?'
              </ripa-alert>
            </template>
            <template
              v-if="model.stopResult.resultsOfStop12 && model.stopVersion === 2"
            >
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
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { STOP_RESULTS, STOP_RESULTS_V2 } from '@/constants/form'

export default {
  name: 'ripa-stop-result',

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaCheckbox,
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      stopResultItems:
        new Date() >= new Date('2024-01-01') ? STOP_RESULTS_V2 : STOP_RESULTS,
    }
  },

  inject: ['isOnlineAndAuthenticated', 'lastResult', 'statutes'],

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    isPullReasonCodeValid() {
      const reasonForStop = this.model.stopReason?.reasonForStop || []
      return [1, 2].includes(reasonForStop)
    },

    isPullReasonCodeWarningVisible() {
      const codes = this.model.stopResult?.warningCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeVerbalWarningVisible() {
      const codes = this.model.stopResult?.verbalWarningCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeWrittenWarningVisible() {
      const codes = this.model.stopResult?.writtenWarningCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeCitationVisible() {
      const codes = this.model.stopResult?.citationCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeInfieldVisible() {
      const codes = this.model.stopResult?.infieldCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeCustodialArrestVisible() {
      const codes = this.model.stopResult?.custodialArrestCodes || []
      const reasonCode = this.getReasonCode()
      return this.isPullReasonCodeValid && !codes.includes(reasonCode)
    },

    isPullReasonCodeWarningDisabled() {
      return this.model.stopResult?.warningCodes.length >= 5
    },

    isPullReasonCodeVerbalWarningDisabled() {
      return this.model.stopResult?.verbalWarningCodes.length >= 5
    },

    isPullReasonCodeWrittenWarningDisabled() {
      return this.model.stopResult?.writtenWarningCodes.length >= 5
    },

    isPullReasonCodeCitationDisabled() {
      return this.model.stopResult?.citationCodes.length >= 5
    },

    isPullReasonCodeInfieldDisable() {
      return this.model.stopResult?.infieldCodes.length >= 5
    },

    isPullReasonCodeCustodialArrestDisabled() {
      return this.model.stopResult?.custodialArrestCodes.length >= 5
    },

    actionsTakenRules() {
      const checked = this.model.stopResult.anyResultsOfStop
      const value2 = this.model.stopResult.resultsOfStop2
      const value3 = this.model.stopResult.resultsOfStop3
      const value4 = this.model.stopResult.resultsOfStop4
      const value5 = this.model.stopResult.resultsOfStop5
      const value6 = this.model.stopResult.resultsOfStop6
      const value7 = this.model.stopResult.resultsOfStop7
      const value8 = this.model.stopResult.resultsOfStop8
      const value9 = this.model.stopResult.resultsOfStop9
      const value10 = this.model.stopResult.resultsOfStop10
      const value11 = this.model.stopResult.resultsOfStop11
      const value12 = this.model.stopResult.resultsOfStop12
      const value13 = this.model.stopResult.resultsOfStop13

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

    actionsTakenRulesV2() {
      const checked = this.model.stopResult.anyResultsOfStop
      const value2 = this.model.stopResult.resultsOfStop2
      const value3 = this.model.stopResult.resultsOfStop3
      const value4 = this.model.stopResult.resultsOfStop4
      const value5 = this.model.stopResult.resultsOfStop5
      const value6 = this.model.stopResult.resultsOfStop6
      const value7 = this.model.stopResult.resultsOfStop7
      const value8 = this.model.stopResult.resultsOfStop8
      const value9 = this.model.stopResult.resultsOfStop9
      const value10 = this.model.stopResult.resultsOfStop10
      const value11 = this.model.stopResult.resultsOfStop11
      const value12 = this.model.stopResult.resultsOfStop12
      const value13 = this.model.stopResult.resultsOfStop13
      const value14 = this.model.stopResult.resultsOfStop14

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
            value13 ||
            value14)) ||
          'An action taken is required',
      ]
    },

    warningRules() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop2
      const options = this.model.stopResult.warningCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    verbalWarningRulesV2() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop2
      const options = this.model.stopResult.verbalWarningCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    writtenWarningRulesV2() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop3
      const options = this.model.stopResult.writtenWarningCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    citationRules() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop3
      const options = this.model.stopResult.citationCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    citationRulesV2() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop4
      const options = this.model.stopResult.citationCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    infieldRules() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop4
      const options = this.model.stopResult.infieldCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    infieldRulesV2() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop5
      const options = this.model.stopResult.infieldCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    custodialArrestRules() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop6
      const options = this.model.stopResult.custodialArrestCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },

    custodialArrestRulesV2() {
      const checked1 = this.model.stopResult.anyResultsOfStop
      const checked2 = this.model.stopResult.resultsOfStop7
      const options = this.model.stopResult.custodialArrestCodes
      return [
        (checked1 && checked2 && options !== null && options.length > 0) ||
          'An offense code is required',
      ]
    },
  },

  methods: {
    handleUpdateModel() {
      if (!this.model.stopResult.anyResultsOfStop) {
        this.model.stopResult.resultsOfStop2 = false
        this.model.stopResult.resultsOfStop3 = false
        this.model.stopResult.resultsOfStop4 = false
        this.model.stopResult.resultsOfStop5 = false
        this.model.stopResult.resultsOfStop6 = false
        this.model.stopResult.resultsOfStop7 = false
        this.model.stopResult.resultsOfStop8 = false
        this.model.stopResult.resultsOfStop9 = false
        this.model.stopResult.resultsOfStop10 = false
        this.model.stopResult.resultsOfStop11 = false
        this.model.stopResult.resultsOfStop12 = false
        this.model.stopResult.resultsOfStop13 = false
      }

      if (!this.model.stopResult.resultsOfStop2) {
        this.model.stopResult.warningCodes = []
      }

      if (!this.model.stopResult.resultsOfStop3) {
        this.model.stopResult.citationCodes = []
      }

      if (!this.model.stopResult.resultsOfStop4) {
        this.model.stopResult.infieldCodes = []
      }

      if (!this.model.stopResult.resultsOfStop6) {
        this.model.stopResult.custodialArrestCodes = []
      }
    },

    handleUpdateModelV2() {
      if (!this.model.stopResult.anyResultsOfStop) {
        this.model.stopResult.resultsOfStop2 = false
        this.model.stopResult.resultsOfStop3 = false
        this.model.stopResult.resultsOfStop4 = false
        this.model.stopResult.resultsOfStop5 = false
        this.model.stopResult.resultsOfStop6 = false
        this.model.stopResult.resultsOfStop7 = false
        this.model.stopResult.resultsOfStop8 = false
        this.model.stopResult.resultsOfStop9 = false
        this.model.stopResult.resultsOfStop10 = false
        this.model.stopResult.resultsOfStop11 = false
        this.model.stopResult.resultsOfStop12 = false
        this.model.stopResult.resultsOfStop13 = false
        this.model.stopResult.resultsOfStop14 = false
      }

      if (!this.model.stopResult.resultsOfStop2) {
        this.model.stopResult.verbalWarningCodes = []
      }

      if (!this.model.stopResult.resultsOfStop3) {
        this.model.stopResult.writtenWarningCodes = []
      }

      if (!this.model.stopResult.resultsOfStop4) {
        this.model.stopResult.citationCodes = []
      }

      if (!this.model.stopResult.resultsOfStop5) {
        this.model.stopResult.infieldCodes = []
      }

      if (!this.model.stopResult.resultsOfStop7) {
        this.model.stopResult.custodialArrestCodes = []
      }
    },

    removeItem(list, statute) {
      this.model.stopResult[list] = this.model.stopResult[list].filter(
        code => code !== statute.item.code,
      )
      this.handleUpdateModel()
    },

    removeItemV2(list, statute) {
      this.model.stopResult[list] = this.model.stopResult[list].filter(
        code => code !== statute.item.code,
      )
      this.handleUpdateModelV2()
    },

    getReasonCode() {
      const trafficViolationCode =
        this.model.stopReason?.trafficViolationCode || null
      const reasonableSuspicionCode =
        this.model.stopReason?.reasonableSuspicionCode || null

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
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.warningCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeVerbalWarning() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.verbalWarningCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeWrittenWarning() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.writtenWarningCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCitation() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.citationCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeInfield() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.infieldCodes.push(reasonCode)
      }
    },

    handlePullReasonCodeCustodialArrest() {
      const reasonCode = this.getReasonCode()
      if (reasonCode) {
        this.model.stopResult.pullFromReasonCode = true
        this.model.stopResult.custodialArrestCodes.push(reasonCode)
      }
    },

    handleOpenFavorites() {
      this.$emit('on-open-result-favorites')
    },

    handleSaveFavorite() {
      this.$emit(
        'on-save-result-favorite',
        this.model.stopResult,
        this.model.stopVersion,
      )
    },
  },

  watch: {
    lastResult(newVal) {
      if (newVal) {
        this.model.stopResult = newVal
      }
    },

    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
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
