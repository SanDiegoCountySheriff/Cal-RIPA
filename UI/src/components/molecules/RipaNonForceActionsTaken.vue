<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Non-Force Actions Taken During Stop"
      required
      :subtitle="'§999.226(a)(15)'"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.nonForceActionsTaken.anyNonForceActionsTaken"
            label="Any Non-Force Actions Taken?"
            :disabled="isAnyActionsTakenDisabled1 || isAnyActionsTakenDisabled2"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.nonForceActionsTaken.anyNonForceActionsTaken">
            <ripa-check-group
              v-model="
                model.nonForceActionsTaken.nonForceActionsTakenDuringStop
              "
              :items="getNonForceActionsTakenGeneralItems"
              :rules="nonForceActionsTakenRules"
              @input="handleInput"
            >
            </ripa-check-group>

            <ripa-subheader text="Search"></ripa-subheader>

            <ripa-check-group
              v-model="
                model.nonForceActionsTaken.nonForceActionsTakenDuringStop
              "
              :items="getNonForceActionsTakenSearchItems"
              :rules="nonForceActionsTakenRules"
              @input="handleInput"
            >
            </ripa-check-group>

            <template v-if="wasAskedForConsentToSearchPerson">
              <ripa-switch
                v-model="model.nonForceActionsTaken.personSearchConsentGiven"
                label="Person Search Consent Given"
                :max-width="300"
                @input="handleInput"
              ></ripa-switch>
            </template>

            <template v-if="wasAskedForConsentToSearchProperty">
              <ripa-switch
                v-model="model.nonForceActionsTaken.propertySearchConsentGiven"
                label="Property Search Consent Given"
                :max-width="300"
                @input="handleInput"
              ></ripa-switch>
            </template>

            <template v-if="wasSearchOfPersonOrPropertyConducted">
              <ripa-form-subheader
                title="Basis for Search"
                required
                subtitle="§999.226(a)(15)(C)"
                v-on="$listeners"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.nonForceActionsTaken.basisForSearch"
                :items="getBasisForSearchItems"
                :rules="basisForSearchRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <template v-if="isBasisForSearchExplanationVisible">
                <template
                  v-if="model.nonForceActionsTaken.basisForSearchPiiFound"
                >
                  <ripa-alert alert-outlined alert-type="warning">
                    The explanation contains personally identifying information.
                    Please remove if possible.
                  </ripa-alert>
                </template>

                <ripa-text-input
                  v-model="model.nonForceActionsTaken.basisForSearchExplanation"
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
              v-model="model.nonForceActionsTaken.propertyWasSeized"
              label="Property was Seized"
              :max-width="200"
              @input="handleInput"
            ></ripa-switch>

            <template v-if="model.nonForceActionsTaken.propertyWasSeized">
              <ripa-form-subheader
                title="Basis for Property Seizure"
                required
                subtitle="§999.226(a)(15)(E)(1)"
                v-on="$listeners"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.nonForceActionsTaken.basisForPropertySeizure"
                :items="getBasisForPropertySeizureItems"
                :rules="basisForPropertySeizureRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <ripa-form-subheader
                title="Types of Property Seized"
                required
                subtitle="§999.226(a)(15)(E)(2)"
                v-on="$listeners"
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.nonForceActionsTaken.typeOfPropertySeized"
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
import {
  NON_FORCE_ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  SEIZED_PROPERTY_TYPES,
  BASIS_FOR_SEARCH_V2,
} from '@/constants/form'
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-non-force-actions-taken',

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
      nonForceActionsTakenItems: NON_FORCE_ACTIONS_TAKEN,
      basisForPropertySeizureItems: BASIS_FOR_PROPERTY_SEIZURE,
      isAnyActionsTakenDisabled1: false,
      isAnyActionsTakenDisabled2: false,
      propertySeizedTypeItems: SEIZED_PROPERTY_TYPES,
    }
  },

  inject: ['loadingPiiStep4'],

  created() {
    this.model.actionsTaken = null
    this.updateModel()

    if (this.model.nonForceActionsTaken.basisForSearchExplanation) {
      this.handlePiiCheck(
        this.model.nonForceActionsTaken.basisForSearchExplanation,
      )
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
    },

    basisForSearchItems() {
      if (this.model.stopVersion === 1) {
        return BASIS_FOR_SEARCH
      }

      return BASIS_FOR_SEARCH_V2
    },

    isBasisForSearchExplanationVisible() {
      if (this.model.nonForceActionsTaken.basisForSearch?.length === 0) {
        return false
      }

      return this.wasSearchOfPersonOrPropertyConducted
    },

    basisForSearchRules() {
      const consentGiven =
        this.model.nonForceActionsTaken.personSearchConsentGiven ||
        this.model.nonForceActionsTaken.propertySearchConsentGiven
      const searchConducted = this.wasSearchOfPersonOrPropertyConducted
      const options = this.model.nonForceActionsTaken.basisForSearch || []

      return [
        (searchConducted && options.length > 0) ||
          'At least one basis for search is required',
        !consentGiven ||
          options.includes(1) ||
          options.includes(14) ||
          options.includes(15) ||
          'Consent given must be selected if person or property consent was given.',
      ]
    },

    wasSearchOfPersonOrPropertyConducted() {
      const actionsTaken =
        this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []
      return actionsTaken.includes(14) || actionsTaken.includes(15)
    },

    basisForPropertySeizureRules() {
      const checked = this.model.nonForceActionsTaken.propertyWasSeized
      const options =
        this.model.nonForceActionsTaken.basisForPropertySeizure || []

      return [
        (checked && options.length > 0) ||
          'At least one basis for property seizure is required',
      ]
    },

    getBasisForPropertySeizureItems() {
      let filteredItems = this.basisForPropertySeizureItems

      if (!this.model.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 6)
      }

      return filteredItems
    },

    getBasisForSearchItems() {
      const actionsTaken =
        this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []
      const basisForSearch =
        this.model.nonForceActionsTaken?.basisForSearch || []
      let filteredItems = this.basisForSearchItems

      if (!this.model.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 13)
      }

      if (
        !this.model.nonForceActionsTaken.personSearchConsentGiven &&
        !this.model.nonForceActionsTaken.propertySearchConsentGiven
      ) {
        filteredItems = filteredItems.filter(
          item => item.value !== 1 && item.value !== 14 && item.value !== 15,
        )
      }

      if (basisForSearch.includes(1)) {
        filteredItems = filteredItems.filter(
          item => item.value !== 14 && item.value !== 15,
        )
      }

      if (basisForSearch.includes(14)) {
        filteredItems = filteredItems.filter(
          item => item.value !== 1 && item.value !== 15,
        )
      }

      if (basisForSearch.includes(15)) {
        filteredItems = filteredItems.filter(
          item => item.value !== 14 && item.value !== 1,
        )
      }

      if (!actionsTaken.includes(15)) {
        return filteredItems.filter(item => item.value !== 12)
      }

      return filteredItems
    },

    wasAskedForConsentToSearchPerson() {
      return this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.includes(
        2,
      )
    },

    wasAskedForConsentToSearchProperty() {
      return this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.includes(
        3,
      )
    },

    getNonForceActionsTakenGeneralItems() {
      let filteredItems = this.nonForceActionsTakenItems.filter(
        item => ![2, 3, 12, 14, 15].includes(item.value),
      )

      if (this.model.stopType !== 'Vehicular') {
        filteredItems = filteredItems.filter(
          item => ![4, 13].includes(item.value),
        )
      }

      if (!this.model.person.isStudent) {
        filteredItems = filteredItems.filter(item => item.value !== 1)
      }

      return filteredItems
    },

    getNonForceActionsTakenSearchItems() {
      return this.nonForceActionsTakenItems
        .filter(item => {
          return [2, 3, 14, 15].includes(item.value)
        })
        .map(item => {
          return {
            ...item,
            disabled:
              (this.isAnyActionsTakenDisabled1 && item.value === 14) ||
              (this.isAnyActionsTakenDisabled2 && item.value === 15),
          }
        })
    },

    nonForceActionsTakenRules() {
      const checked = this.model.nonForceActionsTaken.anyNonForceActionsTaken
      const options =
        this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
          item => item !== 21,
        )

      return [
        (checked && options.length > 0) ||
          'At least one non-force action taken is required',
      ]
    },

    explanationRules() {
      return [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ]
    },

    typeOfPropertySeizedRules() {
      const checked = this.model.nonForceActionsTaken.propertyWasSeized
      const options = this.model.nonForceActionsTaken.typeOfPropertySeized || []

      return [
        (checked && options.length > 0) ||
          'At least one type of property seized is required',
      ]
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
      if (!this.model.nonForceActionsTaken.anyNonForceActionsTaken) {
        this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop = []
        this.model.nonForceActionsTaken.propertyWasSeized = false
        this.model.nonForceActionsTaken.personSearchConsentGiven = false
        this.model.nonForceActionsTaken.propertySearchConsentGiven = false
        this.model.nonForceActionsTaken.basisForSearch = []
        this.model.nonForceActionsTaken.basisForSearchExplanation = null
        this.model.nonForceActionsTaken.basisForSearchPiiFound = false
      }

      if (
        !this.model.nonForceActionsTaken.propertySearchConsentGiven &&
        !this.model.nonForceActionsTaken.personSearchConsentGiven
      ) {
        this.model.nonForceActionsTaken.basisForSearch =
          this.model.nonForceActionsTaken.basisForSearch.filter(basis => {
            return basis !== 1 && basis !== 14 && basis !== 15
          })
      }

      let actionsTaken =
        this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []

      if (actionsTaken.includes(14) && !this.model.stopReason.searchOfPerson) {
        this.$emit('on-set-person-search-automatically-selected', false)
      }

      if (
        actionsTaken.includes(15) &&
        !this.model.stopReason.searchOfProperty
      ) {
        this.$emit('on-set-property-search-automatically-selected', false)
      }

      if (this.model.stopReason) {
        if (this.model.stopReason.searchOfPerson) {
          this.isAnyActionsTakenDisabled1 = true
          this.model.nonForceActionsTaken.anyNonForceActionsTaken = true
          if (!actionsTaken.includes(14)) {
            if (
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop ===
              null
            ) {
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
                []
            }
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.push(
              14,
            )
            this.$emit('on-set-person-search-automatically-selected', true)
          }
        }
        if (this.model.stopReason.searchOfProperty) {
          this.isAnyActionsTakenDisabled2 = true
          this.model.nonForceActionsTaken.anyNonForceActionsTaken = true
          if (!actionsTaken.includes(15)) {
            if (
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop ===
              null
            ) {
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
                []
            }
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.push(
              15,
            )
            this.$emit('on-set-property-search-automatically-selected', true)
          }
        }
      }

      if (!actionsTaken.includes(2)) {
        this.model.nonForceActionsTaken.personSearchConsentGiven = false
      }

      if (!actionsTaken.includes(3)) {
        this.model.nonForceActionsTaken.propertySearchConsentGiven = false
      }

      if (!actionsTaken.includes(14) && !actionsTaken.includes(15)) {
        this.model.nonForceActionsTaken.basisForSearch = []
        this.model.nonForceActionsTaken.basisForSearchExplanation = null
        this.model.nonForceActionsTaken.basisForSearchPiiFound = false
      }

      actionsTaken =
        this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []

      if (
        !actionsTaken.includes(15) &&
        this.model.nonForceActionsTaken.basisForSearch !== null &&
        this.model.nonForceActionsTaken.basisForSearch.length > 0
      ) {
        this.model.nonForceActionsTaken.basisForSearch =
          this.model.nonForceActionsTaken.basisForSearch.filter(
            item => item !== 12,
          )
      }

      if (!this.model.nonForceActionsTaken.basisForPropertySeizure) {
        return
      }

      if (
        this.model.nonForceActionsTaken.basisForPropertySeizure.includes(2) ||
        this.model.nonForceActionsTaken.basisForPropertySeizure.includes(3)
      ) {
        this.model.nonForceActionsTaken.anyContraband = true
      }

      if (!this.model.person.isStudent) {
        if (
          this.model.nonForceActionsTaken.basisForSearch !== null &&
          this.model.nonForceActionsTaken.basisForSearch.length > 0
        ) {
          this.model.nonForceActionsTaken.basisForSearch =
            this.model.nonForceActionsTaken.basisForSearch.filter(
              item => item !== 13,
            )
        }
        if (
          this.model.nonForceActionsTaken.basisForPropertySeizure !== null &&
          this.model.nonForceActionsTaken.basisForPropertySeizure.length > 0
        ) {
          this.model.nonForceActionsTaken.basisForPropertySeizure =
            this.model.nonForceActionsTaken.basisForPropertySeizure.filter(
              item => item !== 6,
            )
        }
      }

      actionsTaken =
        this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []

      if (!this.model.nonForceActionsTaken.propertyWasSeized) {
        this.model.nonForceActionsTaken.basisForPropertySeizure = []
        this.model.nonForceActionsTaken.typeOfPropertySeized = []
        this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
          actionsTaken.filter(item => item !== 12)
      } else {
        if (!actionsTaken.includes(12)) {
          if (
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop ===
            null
          ) {
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop = []
          }
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.push(
            12,
          )
        }
      }
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
