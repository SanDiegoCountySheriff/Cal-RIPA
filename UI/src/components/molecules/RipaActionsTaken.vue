<template>
  <div class="ripa-action-taken tw-pb-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.actionsTaken.anyActionsTaken"
            label="Any Actions Taken?"
            :disabled="isAnyActionsTakenDisabled1 || isAnyActionsTakenDisabled2"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.actionsTaken.anyActionsTaken">
            <ripa-check-group
              v-model="model.actionsTaken.actionsTakenDuringStop"
              :items="getActionsTakenGeneralItems"
              :rules="actionsTakenRules"
              @input="handleInput"
            >
            </ripa-check-group>

            <ripa-subheader text="Search"></ripa-subheader>

            <ripa-check-group
              v-model="model.actionsTaken.actionsTakenDuringStop"
              :items="getActionsTakenSearchItems"
              :rules="actionsTakenRules"
              @input="handleInput"
            >
            </ripa-check-group>

            <template v-if="wasAskedForConsentToSearchPerson">
              <ripa-switch
                v-model="model.actionsTaken.personSearchConsentGiven"
                label="Person Search Consent Given"
                :max-width="300"
                :rules="personPropertySearchConsentGivenRules"
                @input="handleInput"
              ></ripa-switch>
            </template>

            <template v-if="wasAskedForConsentToSearchProperty">
              <ripa-switch
                v-model="model.actionsTaken.propertySearchConsentGiven"
                label="Property Search Consent Given"
                :max-width="300"
                :rules="personPropertySearchConsentGivenRules"
                @input="handleInput"
              ></ripa-switch>
            </template>

            <template v-if="wasSearchOfPersonOrPropertyConducted">
              <ripa-form-subheader
                title="Basis for Search"
                required
                subtitle="§999.226(a)(12)(B)"
                :on-open-statute="onOpenStatute"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.actionsTaken.basisForSearch"
                :items="getBasisForSearchItems"
                :rules="basisForSearchRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <template v-if="isBasisForSearchExplanationVisible">
                <template v-if="model.actionsTaken.basisForSearchPiiFound">
                  <ripa-alert alert-outlined alert-type="warning">
                    The explanation contains personally identifying information.
                    Please remove if possible.
                  </ripa-alert>
                </template>

                <ripa-text-input
                  v-model="model.actionsTaken.basisForSearchExplanation"
                  hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
                  persistent-hint
                  label="Brief Explanation"
                  :loading="loadingPii"
                  :rules="explanationRules"
                  @input="handleInput($event), handlePiiCheck($event)"
                ></ripa-text-input>
              </template>
            </template>

            <ripa-subheader text="Seizure"></ripa-subheader>

            <ripa-switch
              v-model="model.actionsTaken.propertyWasSeized"
              label="Property was Seized"
              :max-width="200"
              @input="handleInput"
            ></ripa-switch>

            <template v-if="model.actionsTaken.propertyWasSeized">
              <ripa-form-subheader
                title="Basis for Property Seizure"
                required
                subtitle="§999.226(a)(12)(D)(1)"
                :on-open-statute="onOpenStatute"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.actionsTaken.basisForPropertySeizure"
                :items="getBasisForPropertySeizureItems"
                :rules="basisForPropertySeizureRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <ripa-form-subheader
                title="Types of Property Seized"
                required
                subtitle="§999.226(a)(12)(D)(2)"
                :on-open-statute="onOpenStatute"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.actionsTaken.typeOfPropertySeized"
                :items="propertySeizedTypeItems"
                :rules="typeOfPropertySeizedRules"
                @input="handleInput"
              >
              </ripa-check-group>
            </template>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import {
  ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  SEIZED_PROPERTY_TYPES,
} from '@/constants/form'

export default {
  name: 'ripa-action-taken',

  mixins: [RipaModelMixin],

  components: {
    RipaAlert,
    RipaFormHeader,
    RipaCheckGroup,
    RipaFormSubheader,
    RipaSubheader,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ],
      actionsTakenItems: ACTIONS_TAKEN,
      basisForSearchItems: BASIS_FOR_SEARCH,
      basisForPropertySeizureItems: BASIS_FOR_PROPERTY_SEIZURE,
      isAnyActionsTakenDisabled1: false,
      isAnyActionsTakenDisabled2: false,
      propertySeizedTypeItems: SEIZED_PROPERTY_TYPES,
      viewModel: this.syncModel(this.value),
    }
  },

  created() {
    if (this.viewModel.actionsTaken.basisForSearchExplanation) {
      this.handlePiiCheck(this.viewModel.actionsTaken.basisForSearchExplanation)
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    actionsTakenRules() {
      const checked = this.viewModel.actionsTaken.anyActionsTaken
      const options = this.viewModel.actionsTaken.actionsTakenDuringStop.filter(
        item => item !== 21,
      )

      return [
        (checked && options.length > 0) ||
          'At least one action taken is required',
      ]
    },

    basisForSearchRules() {
      const consentGiven = this.wasAskedForConsent
      const searchConducted = this.wasSearchOfPersonOrPropertyConducted
      const options = this.viewModel.actionsTaken.basisForSearch

      return [
        (searchConducted && options.length > 0) ||
          'At least one basis for search is required',
        !consentGiven ||
          (consentGiven &&
            this.viewModel.actionsTaken.basisForSearch !== null &&
            this.viewModel.actionsTaken.basisForSearch.length > 0 &&
            this.viewModel.actionsTaken.basisForSearch.includes(1)) ||
          'Consent given must be selected if person or property consent was given.',
      ]
    },

    basisForPropertySeizureRules() {
      const checked = this.viewModel.actionsTaken.propertyWasSeized
      const options = this.viewModel.actionsTaken.basisForPropertySeizure

      return [
        (checked && options.length > 0) ||
          'At least one basis for property seizure is required',
      ]
    },

    personPropertySearchConsentGivenRules() {
      const checked =
        this.viewModel.actionsTaken.personSearchConsentGiven ||
        this.viewModel.actionsTaken.propertySearchConsentGiven
      const basisForSearch = this.viewModel.actionsTaken?.basisForSearch || []
      const consentGiven = basisForSearch.includes(1)

      if (!consentGiven) {
        return []
      }

      return [
        (checked && consentGiven) ||
          '"Basis for Search" indicates "Consent Given" but Person search consent or Property search consent has not been selected',
      ]
    },

    typeOfPropertySeizedRules() {
      const checked = this.viewModel.actionsTaken.propertyWasSeized
      const options = this.viewModel.actionsTaken.typeOfPropertySeized

      return [
        (checked && options.length > 0) ||
          'At least one type of property seized is required',
      ]
    },

    getActionsTakenGeneralItems() {
      const filteredItems = this.actionsTakenItems.filter(
        item => ![17, 18, 19, 20, 21].includes(item.value),
      )

      if (!this.viewModel.person.isStudent) {
        return filteredItems.filter(item => item.value !== 23)
      }

      return filteredItems
    },

    getActionsTakenSearchItems() {
      return this.actionsTakenItems
        .filter(item => [17, 18, 19, 20].includes(item.value))
        .map(item => {
          return {
            ...item,
            disabled:
              (this.isAnyActionsTakenDisabled1 && item.value === 18) ||
              (this.isAnyActionsTakenDisabled2 && item.value === 20),
          }
        })
    },

    getBasisForSearchItems() {
      const actionsTaken =
        this.viewModel.actionsTaken?.actionsTakenDuringStop || []
      let filteredItems = this.basisForSearchItems

      if (!this.viewModel.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 13)
      }

      if (actionsTaken.includes(20)) {
        return filteredItems
      }

      return filteredItems.filter(item => item.value !== 12)
    },

    getBasisForPropertySeizureItems() {
      let filteredItems = this.basisForPropertySeizureItems

      if (!this.viewModel.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 6)
      }

      return filteredItems
    },

    wasSearchOfPersonOrPropertyConducted() {
      const actionsTaken =
        this.viewModel.actionsTaken?.actionsTakenDuringStop || []
      return actionsTaken.includes(18) || actionsTaken.includes(20)
    },

    wasAskedForConsent() {
      return (
        this.viewModel.actionsTaken.personSearchConsentGiven ||
        this.viewModel.actionsTaken.propertySearchConsentGiven
      )
    },

    wasAskedForConsentToSearchPerson() {
      return this.viewModel.actionsTaken.actionsTakenDuringStop.includes(17)
    },

    wasAskedForConsentToSearchProperty() {
      return this.viewModel.actionsTaken.actionsTakenDuringStop.includes(19)
    },

    isBasisForSearchExplanationVisible() {
      if (this.viewModel.actionsTaken.basisForSearch.length === 0) {
        return false
      }

      if (
        this.viewModel.actionsTaken.basisForSearch.length === 1 &&
        this.viewModel.actionsTaken.basisForSearch.includes(4)
      ) {
        return false
      }

      return this.wasSearchOfPersonOrPropertyConducted
    },
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.viewModel)
    },

    handlePiiCheck(textValue) {
      this.$emit('pii-check', { source: 'search', value: textValue })
    },
  },

  mounted() {
    this.updateModel()
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
      this.updateModel()
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
  },
}
</script>
