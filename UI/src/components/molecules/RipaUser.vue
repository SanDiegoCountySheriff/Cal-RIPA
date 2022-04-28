<template>
  <div class="ripa-user">
    <v-container>
      <template v-if="!adminEditing">
        <template v-if="admin">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <ripa-text-input
                v-model="model.id"
                label="ID"
                :disabled="isRowKeyDisabled"
              >
              </ripa-text-input>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" sm="12" md="6">
              <div class="md:tw-mr-4">
                <ripa-text-input
                  v-model="model.firstName"
                  label="First Name"
                  :rules="firstNameRules"
                >
                </ripa-text-input>
              </div>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <div>
                <ripa-text-input
                  v-model="model.lastName"
                  label="Last Name"
                  :rules="lastNameRules"
                >
                </ripa-text-input>
              </div>
            </v-col>
          </v-row>
        </template>

        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <div class="md:tw-mr-4">
              <ripa-date-picker
                v-model="model.startDate"
                label="Start Date"
                :rules="startDateRules"
                @input="handleInput"
              ></ripa-date-picker>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <div>
              <ripa-number-input
                v-model="model.yearsExperience"
                label="Years of Experience"
                :rules="yearsExperienceRules"
                @input="handleInput"
              >
              </ripa-number-input>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" sm="12" md="12">
            <div>
              <ripa-select
                v-model="model.officerRace"
                label="Officer Race"
                :items="raceItems"
                itemText="name"
                itemValue="value"
                :rules="raceRules"
                @input="handleInput"
              ></ripa-select>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <div class="md:tw-mr-4">
              <ripa-text-input
                v-model="model.agency"
                label="Agency"
                :rules="agencyRules"
                @input="handleInput"
              >
              </ripa-text-input>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <ripa-select
              v-model="model.assignment"
              label="Officer Assignment"
              :items="assignmentItems"
              itemText="name"
              itemValue="value"
              :rules="assignmentRules"
              @input="handleInput"
            >
            </ripa-select>
          </v-col>
        </v-row>

        <template v-if="model.assignment === 10">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <ripa-text-input
                v-model="model.otherType"
                label="Other Type"
                :rules="otherTypeRules"
                @input="handleInput"
              >
              </ripa-text-input>
            </v-col>
          </v-row>
        </template>
      </template>

      <template v-if="adminEditing">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <div class="md:tw-mr-4">
              <ripa-number-input
                v-model="model.yearsExperience"
                label="Years of Experience"
                :rules="yearsExperienceRules"
                @input="handleInput"
              >
              </ripa-number-input>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <ripa-select
              v-model="model.assignment"
              label="Officer Assignment"
              :items="assignmentItems"
              itemText="name"
              itemValue="value"
              :rules="assignmentRules"
              @input="handleInput"
            >
            </ripa-select>
          </v-col>
        </v-row>

        <template v-if="model.assignment === 10">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <ripa-text-input
                v-model="model.otherType"
                label="Other Type"
                :rules="otherTypeRules"
                @input="handleInput"
              >
              </ripa-text-input>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-container>
  </div>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import { OFFICER_ASSIGNMENTS, RACES } from '@/constants/form'
import {
  isValidDate,
  dateNotInFuture,
  formatShortDate,
  formatToIsoCurrentDate,
} from '@/utilities/dates'

export default {
  name: 'ripa-officer',

  mixins: [RipaModelMixin],

  components: {
    RipaDatePicker,
    RipaNumberInput,
    RipaSelect,
    RipaTextInput,
  },

  data() {
    return {
      assignmentItems: OFFICER_ASSIGNMENTS,
      raceItems: RACES,
      viewModel: this.value,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    yearsExperienceRules() {
      return [
        v => !!v || 'Years of Experience is required',
        v =>
          (v >= 1 && v <= 50) ||
          'Years of Experience must be between 1 and 50 Years',
      ]
    },

    agencyRules() {
      return [v => !!v || 'An agency is required']
    },

    assignmentRules() {
      return [v => !!v || 'An assignment is required']
    },

    firstNameRules() {
      return [v => !!v || 'A first name is required']
    },

    lastNameRules() {
      return [v => !!v || 'A last name is required']
    },

    raceRules() {
      return [v => !!v || 'An officer race is required']
    },

    startDateRules() {
      const startDate = this.viewModel.startDate
      const isValid = isValidDate(startDate)
      const isNotFuture = dateNotInFuture(startDate)

      return [
        (startDate && startDate.length > 0) || 'Start date is required',
        isValid || 'Start date is not a valid date',
        isNotFuture || 'Start date is in the future',
      ]
    },

    otherTypeRules() {
      const assignment = this.viewModel.assignment
      const otherType = this.viewModel.otherType
      if (assignment !== 10) {
        return []
      }

      return [
        (otherType && otherType.length > 0) || 'Other type is required',
        v => (v || '').length <= 60 || 'Max 60 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ]
    },

    getMaxDate() {
      return formatToIsoCurrentDate()
    },
  },

  methods: {
    handleInput() {
      this.updateStartDateModel()
      this.updateOtherTypeModel()
      this.$emit('input', this.viewModel)
    },

    updateStartDateModel() {
      const startDate = this.viewModel.startDate
      const isValid = isValidDate(startDate)

      if (isValid) {
        this.viewModel.startDate = formatShortDate(startDate)
      }
    },

    updateOtherTypeModel() {
      if (this.viewModel.assignment !== 10) {
        this.viewModel.otherType = null
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    isRowKeyDisabled: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
