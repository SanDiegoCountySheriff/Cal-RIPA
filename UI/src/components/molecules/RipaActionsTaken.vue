<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
    >
    </ripa-form-header>

    <ripa-switch
      v-model="model.actionsTaken.anyActionsTaken"
      label="Any Actions Taken?"
      :disabled="isAnyActionsTakenDisabled"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <template v-if="model.actionsTaken.anyActionsTaken">
      <ripa-check-group
        v-model="model.actionsTaken.actionsTakenDuringStop"
        :items="actionTakenGeneralItems"
        @input="handleInput"
      >
      </ripa-check-group>

      <ripa-subheader text="Search"></ripa-subheader>

      <ripa-check-group
        v-model="model.actionsTaken.actionsTakenDuringStop"
        :items="getActionTakenSearchItems"
        @input="handleInput"
      >
      </ripa-check-group>

      <template v-if="wasAskedForConsentToSearchPerson">
        <ripa-switch
          v-model="model.actionsTaken.personSearchConsentGiven"
          label="Person Search Consent Given"
          :max-width="300"
          @input="handleInput"
        ></ripa-switch>
      </template>

      <template v-if="wasAskedForConsentToSearchProperty">
        <ripa-switch
          v-model="model.actionsTaken.propertySearchConsentGiven"
          label="Property Search Consent Given"
          :max-width="300"
          @input="handleInput"
        ></ripa-switch>
      </template>

      <template v-if="wasSearchConducted">
        <ripa-form-subheader
          title="Basis for Search"
          required
          subtitle="§999.226(a)(12)(B)"
        ></ripa-form-subheader>

        <ripa-check-group
          v-model="model.actionsTaken.basisForSearch"
          :items="basisForSearchItems"
          @input="handleInput"
        >
        </ripa-check-group>

        <ripa-text-area
          v-model="model.actionsTaken.basisForSearchBrief"
          hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
          persistent-hint
          label="Brief Explanation"
          :rules="explanationRules"
          @input="handleInput"
        ></ripa-text-area>
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
        ></ripa-form-subheader>

        <ripa-check-group
          v-model="model.actionsTaken.basisForPropertySeizure"
          :items="basisForPropertySeizureItems"
          @input="handleInput"
        >
        </ripa-check-group>

        <ripa-form-subheader
          title="Types of Property Seized"
          required
          subtitle="§999.226(a)(12)(D)(2)"
        ></ripa-form-subheader>

        <ripa-check-group
          v-model="model.actionsTaken.typesOfPropertySeized"
          :items="propertySeizedTypeItems"
          @input="handleInput"
        >
        </ripa-check-group>
      </template>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextArea from '@/components/atoms/RipaTextArea'
import {
  ACTIONS_TAKEN_GENERAL,
  ACTIONS_TAKEN_SEARCH,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  CONTRABAND_TYPES,
} from '@/constants/form'

export default {
  name: 'ripa-action-taken',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaFormSubheader,
    RipaSubheader,
    RipaSwitch,
    RipaTextArea,
  },

  data() {
    return {
      valid: true,
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
      ],
      actionTakenGeneralItems: ACTIONS_TAKEN_GENERAL,
      actionTakenSearchItems: ACTIONS_TAKEN_SEARCH,
      basisForSearchItems: BASIS_FOR_SEARCH,
      basisForPropertySeizureItems: BASIS_FOR_PROPERTY_SEIZURE,
      isAnyActionsTakenDisabled: false,
      propertySeizedTypeItems: CONTRABAND_TYPES,
      viewModel: {
        stopReason: this.value?.stopReason || null,
        actionsTaken: {
          anyActionsTaken: this.value?.actionsTaken?.anyActionsTaken || false,
          actionsTakenDuringStop:
            this.value?.actionsTaken?.actionsTakenDuringStop || [],
          personSearchConsentGiven:
            this.value?.actionsTaken?.personSearchConsentGiven || false,
          propertySearchConsentGiven:
            this.value?.actionsTaken?.propertySearchConsentGiven || false,
          basisForSearch: this.value?.actionsTaken?.basisForSearch || [],
          basisForSearchBrief:
            this.value?.actionsTaken?.basisForSearchBrief || null,
          propertyWasSeized:
            this.value?.actionsTaken?.propertyWasSeized || false,
          basisForPropertySeizure:
            this.value?.actionsTaken?.basisForPropertySeizure || [],
          typesOfPropertySeized:
            this.value?.actionsTaken?.typesOfPropertySeized || [],
        },
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    getActionTakenSearchItems() {
      return this.actionTakenSearchItems.map(item => {
        return {
          ...item,
          disabled:
            this.isAnyActionsTakenDisabled &&
            (item.value === 18 || item.value === 20),
        }
      })
    },

    wasSearchConducted() {
      return (
        this.viewModel.actionsTaken.actionsTakenDuringStop.includes(18) ||
        this.viewModel.actionsTaken.actionsTakenDuringStop.includes(20)
      )
    },

    wasAskedForConsentToSearchPerson() {
      return this.viewModel.actionsTaken.actionsTakenDuringStop.includes(17)
    },

    wasAskedForConsentToSearchProperty() {
      return this.viewModel.actionsTaken.actionsTakenDuringStop.includes(19)
    },
  },

  methods: {
    handleInput() {
      this.updateActionsTakenModel()
      this.updateBasisForPropertySeizedModel()
      this.updateSearchModel()
      this.$emit('input', this.viewModel)
    },

    updateActionsTakenModel() {
      if (!this.viewModel.actionsTaken.anyActionsTaken) {
        this.viewModel.actionsTaken.actionsTakenDuringStop = []
        this.viewModel.actionsTaken.propertyWasSeized = false
      }
    },

    updateBasisForPropertySeizedModel() {
      if (!this.viewModel.actionsTaken.propertyWasSeized) {
        this.viewModel.actionsTaken.basisForPropertySeizure = []
        this.viewModel.actionsTaken.typesOfPropertySeized = []
      }
    },

    updateSearchModel() {
      if (this.viewModel.stopReason) {
        if (this.viewModel.stopReason.searchOfPerson) {
          this.isAnyActionsTakenDisabled = true
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(18) ===
            -1
          ) {
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(18)
          }
        }
        if (this.viewModel.stopReason.searchOfProperty) {
          this.isAnyActionsTakenDisabled = true
          this.viewModel.actionsTaken.anyActionsTaken = true
          if (
            this.viewModel.actionsTaken.actionsTakenDuringStop.indexOf(20) ===
            -1
          ) {
            this.viewModel.actionsTaken.actionsTakenDuringStop.push(20)
          }
        }
      }

      if (!this.viewModel.actionsTaken.actionsTakenDuringStop.includes(17)) {
        this.viewModel.actionsTaken.personSearchConsentGiven = false
      }

      if (!this.viewModel.actionsTaken.actionsTakenDuringStop.includes(19)) {
        this.viewModel.actionsTaken.propertySearchConsentGiven = false
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel.stopReason = newVal.stopReason || null
      this.updateSearchModel()
    },
  },

  mounted() {
    this.updateSearchModel()
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
