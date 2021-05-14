<template>
  <div class="ripa-action-taken tw-pb-8">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
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
                :items="getBasisForSearchItems"
                :rules="basisForSearchRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <template v-if="isBasisForSearchExplanationVisible">
                <template v-if="model.actionsTaken.basisForSearchPiiFound">
                  <v-alert outlined type="warning" dense>
                    The explanation contains personally identifying information.
                    Please remove if possible.
                  </v-alert>
                </template>

                <ripa-text-area
                  v-model="model.actionsTaken.basisForSearchExplanation"
                  hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
                  persistent-hint
                  label="Brief Explanation"
                  :loading="loadingPii"
                  :rules="explanationRules"
                  @input="handleInput"
                ></ripa-text-area>
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
              ></ripa-form-subheader>

              <ripa-check-group
                v-model="model.actionsTaken.basisForPropertySeizure"
                :items="basisForPropertySeizureItems"
                :rules="basisForPropertySeizureRules"
                @input="handleInput"
              >
              </ripa-check-group>

              <ripa-form-subheader
                title="Types of Property Seized"
                required
                subtitle="§999.226(a)(12)(D)(2)"
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
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextArea from '@/components/atoms/RipaTextArea'
import {
  ACTIONS_TAKEN,
  BASIS_FOR_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  SEIZED_PROPERTY_TYPES,
} from '@/constants/form'

export default {
  name: 'ripa-action-taken',

  mixins: [RipaFormMixin],

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
      actionsTakenItems: ACTIONS_TAKEN,
      basisForSearchItems: BASIS_FOR_SEARCH,
      basisForPropertySeizureItems: BASIS_FOR_PROPERTY_SEIZURE,
      isAnyActionsTakenDisabled: false,
      propertySeizedTypeItems: SEIZED_PROPERTY_TYPES,
      viewModel: this.loadModel(this.value),
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
      const options = this.viewModel.actionsTaken.actionsTakenDuringStop
      return [
        (checked && options.length > 0) ||
          'At least one action taken is required',
      ]
    },

    basisForSearchRules() {
      const searchConducted = this.wasSearchConducted
      const options = this.viewModel.actionsTaken.basisForSearch
      return [
        (searchConducted && options.length > 0) ||
          'At least basis for search is required',
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

    typeOfPropertySeizedRules() {
      const checked = this.viewModel.actionsTaken.propertyWasSeized
      const options = this.viewModel.actionsTaken.typeOfPropertySeized
      return [
        (checked && options.length > 0) ||
          'At least one type of property seized is required',
      ]
    },

    getActionsTakenGeneralItems() {
      return this.actionsTakenItems.filter(
        item => ![17, 18, 19, 20].includes(item.value),
      )
    },

    getActionsTakenSearchItems() {
      return this.actionsTakenItems
        .filter(item => [17, 18, 19, 20].includes(item.value))
        .map(item => {
          return {
            ...item,
            disabled:
              this.isAnyActionsTakenDisabled &&
              (item.value === 18 || item.value === 20),
          }
        })
    },

    getBasisForSearchitems() {
      const actionsTaken =
        this.viewModel.actionsTaken?.actionsTakenDuringStop || []
      if (actionsTaken.includes(20)) {
        return this.basisForSearchItems
      }

      return this.basisForSearchItems.filter(item => item.value !== 12)
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

      return true
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
        this.viewModel.actionsTaken.typeOfPropertySeized = []
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

  mounted() {
    this.updateSearchModel()
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
      this.updateSearchModel()
    },

    'value.actionsTaken.basisForSearchPiiFound': {
      handler(newVal) {
        this.viewModel.actionsTaken.basisForSearchPiiFound = newVal
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
  },
}
</script>
