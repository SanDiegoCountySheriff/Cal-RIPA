<template>
  <div class="ripa-stop-reason tw-pb-4">
    <ripa-form-header
      title="Reason for Stop"
      required
      :subtitle="
        model.stopVersion === 1 ? '§999.226(a)(10)' : '§999.226(a)(14)'
      "
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

      <v-row>
        <v-col
          v-if="
            favoriteReasons.filter(item => item.version === model.stopVersion)
              .length > 0
          "
          class="text-center py-0"
        >
          Top 5 Favorites
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <v-btn
            v-for="(item, index) in favoriteReasons
              .filter(item => item.version === model.stopVersion)
              .slice(0, 5)"
            :key="index"
            @click="handleFavoriteClick(item)"
            color="primary"
            class="mr-3 mb-2"
            small
            outlined
          >
            {{ item.name }}
          </v-btn>
        </v-col>
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
            @input="handleUpdateModel"
          ></ripa-select>

          <template v-if="model.stopReason.reasonForStop === 7">
            <ripa-radio-group
              v-model="model.stopReason.educationViolation"
              :items="educationViolationItems"
              :rules="educationViolationRules"
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
              ></ripa-autocomplete>
            </template>
          </template>

          <template v-if="model.stopReason.reasonForStop === 1">
            <ripa-radio-group
              v-model="model.stopReason.trafficViolation"
              :items="trafficViolationItems"
              :rules="trafficViolationRules"
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
            ></ripa-autocomplete>
          </template>

          <template v-if="model.stopReason.reasonForStop === 2">
            <ripa-check-group
              v-model="model.stopReason.reasonableSuspicion"
              :items="getReasonableSuspicionItems"
              :rules="reasonableSuspicionRules"
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
              :rules="searchRules"
              @input="handleUpdateModel"
            ></ripa-switch>

            <ripa-switch
              v-model="model.stopReason.searchOfProperty"
              label="Search of property was conducted"
              :max-width="300"
              :rules="searchRules"
              @input="handleUpdateModel"
            ></ripa-switch>
          </template>

          <template v-if="model.stopReason.reasonForStop === 9">
            <ripa-check-group
              v-model="model.stopReason.probableCause"
              :items="getProbableCauseItems"
              :rules="probableCauseRules"
            ></ripa-check-group>

            <ripa-autocomplete
              v-model="model.stopReason.probableCauseCode"
              item-text="fullName"
              item-value="code"
              label="Offense Code"
              :items="statutes"
              :rules="probableCauseCodeRules"
            ></ripa-autocomplete>
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
            @blur="handlePiiCheck($event)"
          ></ripa-text-input>
        </v-col>
      </v-row>
    </v-container>

    <ripa-form-header
      v-if="model.stopVersion === 2"
      title="Reason given to the stopped person"
      required
      subtitle="§999.226(a)(21)"
      v-on="$listeners"
    ></ripa-form-header>

    <v-container v-if="model.stopVersion === 2">
      <v-row no-gutters>
        <v-col cols="12" sm="12" class="tw-mb-4"> </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-select
            v-model="model.stopReason.reasonGivenForStop"
            item-text="name"
            item-value="value"
            label="Reason"
            multiple
            required
            :items="getGivenReasonItems"
            :rules="givenReasonRules"
            @input="handleUpdateModel"
          >
            <template #selection="{ item }">
              <v-chip
                v-bind="item.attrs"
                :input-value="item.selected"
                close
                small
                @click:close="handleRemoveItem(item)"
              >
                {{ item.abbreviation }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-container>

    <template v-if="model.stopType === 'Vehicular' && model.stopVersion === 2">
      <ripa-form-header
        title="The stopped person is a passenger in a vehicle"
        required
        :items="statutes"
        :subtitle="'§999.226(a)(14)(D)'"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row>
          <v-col>
            <ripa-switch
              v-model="model.person.passengerInVehicle"
              label="The stopped person is a passenger in a vehicle"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-if="model.stopType === 'Pedestrian' && model.stopVersion === 2">
      <ripa-form-header
        title="The stopped person was inside a residence"
        required
        :items="statutes"
        :subtitle="'§999.226(a)(14)(D)'"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row>
          <v-col>
            <ripa-switch
              v-model="model.person.insideResidence"
              label="The stopped person is inside a residence, where an officer was executing a search or arrest warrant naming or identifying another person, conducting a search pursuant to a condition of another person’s parole, probation, PRCS, or mandatory supervision, or conducting a compliance check on another person under home detention or house arrest."
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import {
  STOP_REASONS,
  STOP_REASONS_V2,
  GIVEN_STOP_REASONS_V2,
  PROBABLE_CAUSES,
  EDUCATION_VIOLATIONS,
  TRAFFIC_VIOLATIONS,
  REASONABLE_SUSPICIONS,
  REASONABLE_SUSPICIONS_V2,
  EDUCATION_CODE_SECTIONS,
} from '@/constants/form'

export default {
  name: 'ripa-stop-reason',

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
      givenReasonRules: [
        v => (!!v && v.length > 0) || 'Given stop reason is required',
      ],
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ],
      reasonItems: STOP_REASONS,
      reasonItemsV2: STOP_REASONS_V2,
      givenReasonItemsV2: GIVEN_STOP_REASONS_V2,
      probableCauses: PROBABLE_CAUSES,
      educationCodeSectionItems: EDUCATION_CODE_SECTIONS,
      educationViolationItems: EDUCATION_VIOLATIONS,
      trafficViolationItems: TRAFFIC_VIOLATIONS,
      reasonableSuspicionCodesV1: REASONABLE_SUSPICIONS,
      reasonableSuspicionCodesV2: REASONABLE_SUSPICIONS_V2,
    }
  },

  inject: [
    'isOnlineAndAuthenticated',
    'lastReason',
    'loadingPiiStep3',
    'statutes',
    'personSearchAutomaticallySelected',
    'propertySearchAutomaticallySelected',
    'favoriteReasons',
  ],

  created() {
    if (
      this.model.stopReason.reasonForStopExplanation &&
      !this.model.template
    ) {
      this.handlePiiCheck(this.model.stopReason.reasonForStopExplanation)
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    getReasonableSuspicionItems() {
      return this.model.stopVersion === 1
        ? this.reasonableSuspicionCodesV1
        : this.reasonableSuspicionCodesV2
    },

    getProbableCauseItems() {
      return this.probableCauses
    },

    getReasonItems() {
      const reasonItems =
        this.model.stopVersion === 1 ? this.reasonItems : this.reasonItemsV2

      if (this.model.person.isStudent) {
        return reasonItems
      }

      return reasonItems.filter(item => item.value !== 7 && item.value !== 8)
    },

    getGivenReasonItems() {
      const givenReasonItems = this.givenReasonItemsV2
      if (this.model.person.isStudent) {
        return givenReasonItems
      }

      return givenReasonItems.filter(
        item => item.value !== 20 && item.value !== 21,
      )
    },

    educationViolationRules() {
      const checked = this.model.stopReason.reasonForStop === 7
      const options = this.model.stopReason.educationViolation
      return [
        (checked && options !== null) ||
          'An education violation type is required',
      ]
    },

    educationViolationCodeRules() {
      const checked1 = this.model.stopReason.reasonForStop === 7
      const checked2 = this.model.stopReason.educationViolation === 1
      const code = this.model.stopReason.educationViolationCode
      return [
        (checked1 && checked2 && code !== null) ||
          'An offense code is required',
      ]
    },

    trafficViolationRules() {
      const checked = this.model.stopReason.reasonForStop === 1
      const options = this.model.stopReason.trafficViolation
      return [
        (checked && options !== null) || 'A traffic violation type is required',
      ]
    },

    trafficViolationCodeRules() {
      const checked = this.model.stopReason.reasonForStop === 1
      const code = this.model.stopReason.trafficViolationCode
      return [(checked && code !== null) || 'An offense code is required']
    },

    reasonableSuspicionRules() {
      const checked = this.model.stopReason.reasonForStop === 2
      const options = this.model.stopReason.reasonableSuspicion
      return [
        (checked && options !== null && options.length > 0) ||
          'A reasonable suspicion type is required',
      ]
    },

    probableCauseRules() {
      const checked = this.model.stopReason.reasonForStop === 9
      const options = this.model.stopReason.probableCause
      return [
        (checked && options !== null && options?.length > 0) ||
          'A probable cause type is required',
      ]
    },

    probableCauseCodeRules() {
      const checked = this.model.stopReason.reasonForStop === 9
      const code = this.model.stopReason.probableCauseCode
      return [(checked && code !== null) || 'An offense code is required']
    },

    reasonableSuspicionCodeRules() {
      const checked = this.model.stopReason.reasonForStop === 2
      const code = this.model.stopReason.reasonableSuspicionCode
      return [(checked && code !== null) || 'An offense code is required']
    },

    searchRules() {
      const checked = this.model.stopReason.reasonForStop === 6
      const checkedPerson = this.model.stopReason.searchOfPerson
      const checkedProperty = this.model.stopReason.searchOfProperty
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
    handleOpenFavorites() {
      this.$emit('on-open-reason-favorites', this.model.stopVersion)
    },

    handleSaveFavorite() {
      this.$emit(
        'on-save-reason-favorite',
        this.model.stopReason,
        this.model.stopVersion,
      )
    },

    handlePiiCheck(textValue) {
      this.$emit('pii-check', { source: 'reason', value: textValue })
    },

    handleRemoveItem(item) {
      const index = this.model.stopReason.reasonGivenForStop.indexOf(item.value)
      if (index !== -1) {
        this.model.stopReason.reasonGivenForStop.splice(index, 1)
      }
    },

    handleUpdateModel() {
      if (this.model.stopReason.reasonForStop !== 6) {
        this.model.stopReason.searchOfPerson = false
        this.model.stopReason.searchOfProperty = false
      }
      if (this.model.stopReason.reasonForStop !== 2) {
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
      }

      if (this.model.stopReason.reasonForStop !== 9) {
        this.model.stopReason.probableCause = []
        this.model.stopReason.probableCauseCode = null
      }

      if (
        this.model.stopReason.reasonForStop === 6 &&
        this.model.stopVersion === 1
      ) {
        const actionsTaken =
          this.model.actionsTaken?.actionsTakenDuringStop || []
        if (this.model.stopReason.searchOfPerson) {
          this.model.actionsTaken.anyActionsTaken = true
          if (!actionsTaken.includes(18)) {
            if (this.model.actionsTaken.actionsTakenDuringStop === null) {
              this.model.actionsTaken.actionsTakenDuringStop = []
            }
            this.model.actionsTaken.actionsTakenDuringStop.push(18)
          }
        } else {
          if (
            this.model.actionsTaken.actionsTakenDuringStop !== null &&
            this.model.actionsTaken.actionsTakenDuringStop.length > 0
          ) {
            this.model.actionsTaken.actionsTakenDuringStop =
              this.model.actionsTaken.actionsTakenDuringStop.filter(
                item => item !== 18,
              )
          }
        }
        if (this.model.stopReason.searchOfProperty) {
          this.model.actionsTaken.anyActionsTaken = true
          if (!actionsTaken.includes(20)) {
            if (this.model.actionsTaken.actionsTakenDuringStop === null) {
              this.model.actionsTaken.actionsTakenDuringStop = []
            }
            this.model.actionsTaken.actionsTakenDuringStop.push(20)
          }
        } else {
          if (
            this.model.actionsTaken.actionsTakenDuringStop !== null &&
            this.model.actionsTaken.actionsTakenDuringStop.length > 0
          ) {
            this.model.actionsTaken.actionsTakenDuringStop =
              this.model.actionsTaken.actionsTakenDuringStop.filter(
                item => item !== 20,
              )
          }
        }
      }

      if (
        this.model.stopReason.reasonForStop === 6 &&
        this.model.stopVersion === 2
      ) {
        const actionsTaken =
          this.model.nonForceActionsTaken?.nonForceActionsTakenDuringStop || []
        if (this.model.stopReason.searchOfPerson) {
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
          }
        } else {
          if (
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop !==
              null &&
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop
              .length > 0
          ) {
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
                item => item !== 14,
              )
          }
        }
        if (this.model.stopReason.searchOfProperty) {
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
          }
        } else {
          if (
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop !==
              null &&
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop
              .length > 0
          ) {
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
              this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
                item => item !== 15,
              )
          }
        }
      }

      if (
        this.model.stopReason.reasonForStop === 1 &&
        this.model.stopVersion === 1
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 18,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 20,
            )
        }
      }

      if (
        this.model.stopReason.reasonForStop === 1 &&
        this.model.stopVersion === 2
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 14,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 15,
            )
        }
      }

      if (
        this.model.stopReason.reasonForStop === 2 &&
        this.model.stopVersion === 1
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 18,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 20,
            )
        }
      }

      if (
        this.model.stopReason.reasonForStop === 2 &&
        this.model.stopVersion === 2
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 14,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 15,
            )
        }
      }

      if (
        this.model.stopReason.reasonForStop === 7 &&
        this.model.stopVersion === 1
      ) {
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null

        if (this.model.stopReason.educationViolation !== 1) {
          this.model.stopReason.educationViolationCode = null
        }

        if (this.personSearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 18,
            )
        }

        if (this.propertySearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 20,
            )
        }
      }

      if (
        this.model.stopReason.reasonForStop === 7 &&
        this.model.stopVersion === 2
      ) {
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null

        if (this.model.stopReason.educationViolation !== 1) {
          this.model.stopReason.educationViolationCode = null
        }

        if (this.personSearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 14,
            )
        }

        if (this.propertySearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 15,
            )
        }
      }

      if (
        (this.model.stopReason.reasonForStop === 3 ||
          this.model.stopReason.reasonForStop === 4 ||
          this.model.stopReason.reasonForStop === 5 ||
          this.model.stopReason.reasonForStop === 8) &&
        this.model.stopVersion === 1
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 18,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 20,
            )
        }
      }

      if (
        (this.model.stopReason.reasonForStop === 3 ||
          this.model.stopReason.reasonForStop === 4 ||
          this.model.stopReason.reasonForStop === 5 ||
          this.model.stopReason.reasonForStop === 8) &&
        this.model.stopVersion === 2
      ) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null
        if (this.personSearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 14,
            )
        }
        if (this.propertySearchAutomaticallySelected) {
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
            this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
              item => item !== 15,
            )
        }
      }

      if (this.model.stopReason.reasonForStop === 6) {
        this.model.stopReason.educationViolation = null
        this.model.stopReason.educationViolationCode = null
        this.model.stopReason.reasonableSuspicion = []
        this.model.stopReason.reasonableSuspicionCode = null
        this.model.stopReason.trafficViolation = null
        this.model.stopReason.trafficViolationCode = null
      }
    },

    handleFavoriteClick(favorite) {
      this.$emit('on-open-favorite-reason', favorite.id)
    },
  },

  watch: {
    lastReason(newVal) {
      if (newVal) {
        this.model.stopReason = { ...newVal }
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
