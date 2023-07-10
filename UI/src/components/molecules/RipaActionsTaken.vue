<template>
  <div class="ripa-action-taken tw-pb-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
      v-on="$listeners"
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
                v-on="$listeners"
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
                  :loading="loadingPiiStep4"
                  :rules="explanationRules"
                  @input="handleInput"
                  @blur="handlePiiCheck($event)"
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
                v-on="$listeners"
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
                v-on="$listeners"
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
    }
  },

  inject: ['loadingPiiStep4'],

  created() {
    if (this.model.actionsTaken.basisForSearchExplanation) {
      this.handlePiiCheck(this.model.actionsTaken.basisForSearchExplanation)
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
    },

    actionsTakenRules() {
      const checked = this.model.actionsTaken.anyActionsTaken
      const options = this.model.actionsTaken.actionsTakenDuringStop.filter(
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
      const options = this.model.actionsTaken.basisForSearch || []

      return [
        (searchConducted && options.length > 0) ||
          'At least one basis for search is required',
        !consentGiven ||
          (consentGiven &&
            this.model.actionsTaken.basisForSearch !== null &&
            this.model.actionsTaken.basisForSearch.length > 0 &&
            this.model.actionsTaken.basisForSearch.includes(1)) ||
          'Consent given must be selected if person or property consent was given.',
      ]
    },

    basisForPropertySeizureRules() {
      const checked = this.model.actionsTaken.propertyWasSeized
      const options = this.model.actionsTaken.basisForPropertySeizure || []

      return [
        (checked && options.length > 0) ||
          'At least one basis for property seizure is required',
      ]
    },

    personPropertySearchConsentGivenRules() {
      const checked =
        this.model.actionsTaken.personSearchConsentGiven ||
        this.model.actionsTaken.propertySearchConsentGiven
      const basisForSearch = this.model.actionsTaken?.basisForSearch || []
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
      const checked = this.model.actionsTaken.propertyWasSeized
      const options = this.model.actionsTaken.typeOfPropertySeized || []

      return [
        (checked && options.length > 0) ||
          'At least one type of property seized is required',
      ]
    },

    getActionsTakenGeneralItems() {
      const filteredItems = this.actionsTakenItems.filter(
        item => ![17, 18, 19, 20, 21].includes(item.value),
      )

      if (!this.model.person.isStudent) {
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
      const actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []
      let filteredItems = this.basisForSearchItems

      if (!this.model.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 13)
      }

      if (actionsTaken.includes(20)) {
        return filteredItems
      }

      return filteredItems.filter(item => item.value !== 12)
    },

    getBasisForPropertySeizureItems() {
      let filteredItems = this.basisForPropertySeizureItems

      if (!this.model.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 6)
      }

      return filteredItems
    },

    wasSearchOfPersonOrPropertyConducted() {
      const actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []
      return actionsTaken.includes(18) || actionsTaken.includes(20)
    },

    wasAskedForConsent() {
      return (
        this.model.actionsTaken.personSearchConsentGiven ||
        this.model.actionsTaken.propertySearchConsentGiven
      )
    },

    wasAskedForConsentToSearchPerson() {
      return this.model.actionsTaken.actionsTakenDuringStop.includes(17)
    },

    wasAskedForConsentToSearchProperty() {
      return this.model.actionsTaken.actionsTakenDuringStop.includes(19)
    },

    isBasisForSearchExplanationVisible() {
      if (this.model.actionsTaken.basisForSearch.length === 0) {
        return false
      }

      return this.wasSearchOfPersonOrPropertyConducted
    },
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.model)
    },

    handlePiiCheck(textValue) {
      this.$emit('pii-check', { source: 'search', value: textValue })
    },

    updateModel() {
      if (!this.model.actionsTaken.anyActionsTaken) {
        this.model.actionsTaken.actionsTakenDuringStop = null
        this.model.actionsTaken.propertyWasSeized = false
        this.model.actionsTaken.personSearchConsentGiven = false
        this.model.actionsTaken.propertySearchConsentGiven = false
        this.model.actionsTaken.basisForSearch = []
        this.model.actionsTaken.basisForSearchExplanation = null
        this.model.actionsTaken.basisForSearchPiiFound = false
      }

      let actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []

      if (actionsTaken.includes(18) && !this.model.stopReason.searchOfPerson) {
        this.$emit('on-set-person-search-automatically-selected', false)
      }

      if (
        actionsTaken.includes(20) &&
        !this.model.stopReason.searchOfProperty
      ) {
        this.$emit('on-set-property-search-automatically-selected', false)
      }

      if (this.model.stopReason) {
        if (this.model.stopReason.searchOfPerson) {
          this.isAnyActionsTakenDisabled1 = true
          this.model.actionsTaken.anyActionsTaken = true
          if (!actionsTaken.includes(18)) {
            if (this.model.actionsTaken.actionsTakenDuringStop === null) {
              this.model.actionsTaken.actionsTakenDuringStop = []
            }
            this.model.actionsTaken.actionsTakenDuringStop.push(18)
            this.$emit('on-set-person-search-automatically-selected', true)
          }
        }
        if (this.model.stopReason.searchOfProperty) {
          this.isAnyActionsTakenDisabled2 = true
          this.model.actionsTaken.anyActionsTaken = true
          if (!actionsTaken.includes(20)) {
            if (this.model.actionsTaken.actionsTakenDuringStop === null) {
              this.model.actionsTaken.actionsTakenDuringStop = []
            }
            this.model.actionsTaken.actionsTakenDuringStop.push(20)
            this.$emit('on-set-property-search-automatically-selected', true)
          }
        }
      }

      if (!actionsTaken.includes(17)) {
        this.model.actionsTaken.personSearchConsentGiven = false
      }

      if (!actionsTaken.includes(19)) {
        this.model.actionsTaken.propertySearchConsentGiven = false
      }

      if (!actionsTaken.includes(18) && !actionsTaken.includes(20)) {
        this.model.actionsTaken.basisForSearch = []
        this.model.actionsTaken.basisForSearchExplanation = null
        this.model.actionsTaken.basisForSearchPiiFound = false
      }

      if (
        this.model.actionsTaken.basisForSearch !== null &&
        this.model.actionsTaken.basisForSearch.length === 1 &&
        this.model.actionsTaken.basisForSearch.includes(4)
      ) {
        this.model.actionsTaken.basisForSearchExplanation = null
        this.model.actionsTaken.basisForSearchPiiFound = false
      }

      actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []

      if (
        !actionsTaken.includes(20) &&
        this.model.actionsTaken.basisForSearch !== null &&
        this.model.actionsTaken.basisForSearch.length > 0
      ) {
        this.model.actionsTaken.basisForSearch =
          this.model.actionsTaken.basisForSearch.filter(item => item !== 12)
      }

      if (!this.model.actionsTaken.basisForPropertySeizure) {
        return
      }

      if (
        this.model.actionsTaken.basisForPropertySeizure.includes(2) ||
        this.model.actionsTaken.basisForPropertySeizure.includes(3)
      ) {
        this.model.actionsTaken.anyContraband = true
      }

      if (!this.model.person.isStudent) {
        if (
          this.model.actionsTaken.basisForSearch !== null &&
          this.model.actionsTaken.basisForSearch.length > 0
        ) {
          this.model.actionsTaken.basisForSearch =
            this.model.actionsTaken.basisForSearch.filter(item => item !== 13)
        }
        if (
          this.model.actionsTaken.basisForPropertySeizure !== null &&
          this.model.actionsTaken.basisForPropertySeizure.length > 0
        ) {
          this.model.actionsTaken.basisForPropertySeizure =
            this.model.actionsTaken.basisForPropertySeizure.filter(
              item => item !== 6,
            )
        }
      }

      actionsTaken = this.model.actionsTaken?.actionsTakenDuringStop || []

      if (!this.model.actionsTaken.propertyWasSeized) {
        this.model.actionsTaken.basisForPropertySeizure = []
        this.model.actionsTaken.typeOfPropertySeized = null
        this.model.actionsTaken.actionsTakenDuringStop = actionsTaken.filter(
          item => item !== 21,
        )
      } else {
        if (!actionsTaken.includes(21)) {
          if (this.model.actionsTaken.actionsTakenDuringStop === null) {
            this.model.actionsTaken.actionsTakenDuringStop = []
          }
          this.model.actionsTaken.actionsTakenDuringStop.push(21)
        }
      }
    },
  },

  mounted() {
    this.updateModel()
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
