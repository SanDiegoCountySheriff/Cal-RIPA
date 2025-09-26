<template>
  <div class="ripa-stop-date tw-pb-4">
    <ripa-form-header
      title="Date of Stop"
      required
      :subtitle="model.stopVersion === 1 ? '§999.226(a)(2)' : '§999.226(a)(3)'"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4">
          <div class="md:tw-mr-4">
            <ripa-date-picker
              v-model="model.stopDate.date"
              label="Date of Stop"
              :rules="dateRules"
              :min="getMinDate"
              :max="getMaxDate"
            >
            </ripa-date-picker>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="4">
          <div class="md:tw-mr-4">
            <ripa-time-picker
              v-model="model.stopDate.time"
              label="Time of Stop"
              :rules="timeRules"
            >
            </ripa-time-picker>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="4">
          <ripa-number-input
            v-model="model.stopDate.duration"
            label="Stop Duration"
            hint="Duration of Stop should be defined in minutes. Maximum of 1440."
            :min="1"
            :max="1440"
            :rules="durationRules"
          >
          </ripa-number-input>
        </v-col>
      </v-row>

      <v-row v-if="this.environmentName === 'DEV'">
        <v-btn @click="handleDevTime" class="ml-3 mb-3" small color="primary">
          Convert to Version {{ model.stopVersion === 1 ? '2' : '1' }} Stop
        </v-btn>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.stopDate.stopInResponseToCFS"
            label="Stop in response to Call for Service"
            :max-width="300"
          ></ripa-switch>
        </v-col>
      </v-row>

      <v-row v-if="model.stopVersion === 2" no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.officerWorksWithNonReportingAgency"
            label="Officer is secondary to a non-reporting agency"
            :max-width="300"
          ></ripa-switch>
        </v-col>
      </v-row>

      <v-row v-if="isLateStop" class="tw-mt-4">
        <v-col cols="12">
          <v-alert type="warning" dense outlined class="mt-2">
            This stop is being submitted more than 24 hours after it occurred.
            Please provide an explanation for the late submission.
          </v-alert>
        </v-col>
      </v-row>

      <v-row v-if="isLateStop">
        <v-col>
          <v-text-field
            v-model="model.lateSubmissionExplanation"
            :rules="lateExplanationRules"
            label="Explanation for Late Submission"
            required
            dense
          />
        </v-col>
      </v-row>
    </v-container>

    <template v-if="model.stopVersion === 2">
      <ripa-form-header
        title="Welfare or Wellness Check"
        required
        subtitle="§999.226(a)(13)"
        v-on="$listeners"
      >
      </ripa-form-header>

      <v-container>
        <v-row>
          <v-col>
            <ripa-switch
              v-model="model.stopMadeDuringWelfareCheck"
              label="Stop made during the course of performing a welfare or wellness check or an officer’s community caretaking function."
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import {
  dateWithinLastHours,
  dateNotInFuture,
  formatToIsoCurrentDate,
  formatToIsoDate,
} from '@/utilities/dates'

export default {
  name: 'ripa-stop-date',

  components: {
    RipaFormHeader,
    RipaDatePicker,
    RipaNumberInput,
    RipaSwitch,
    RipaTimePicker,
  },

  data() {
    return {
      devTime: this.value.stopVersion === 2,
    }
  },

  inject: ['isAdminEditing', 'environmentName'],

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        if (
          new Date(
            newVal.stopDate.date?.split('-')[0],
            newVal.stopDate.date?.split('-')[1] - 1,
            newVal.stopDate.date?.split('-')[2],
          ).getFullYear() >= 2024
        ) {
          newVal.stopVersion = 2
        } else {
          newVal.stopVersion = 1
        }

        this.$emit('input', newVal)
      },
    },

    isLateStop() {
      const dateStr = this.model.stopDate.date
      const timeStr = this.model.stopDate.time
      if (!dateStr || !timeStr) return false
      return (
        !dateWithinLastHours(dateStr, timeStr, 24) &&
        dateNotInFuture(dateStr, timeStr)
      )
    },

    dateRules() {
      return [
        v => !!v || 'A date is required',
        v =>
          (v &&
            dateNotInFuture(
              this.model.stopDate.date,
              this.model.stopDate.time,
            )) ||
          'Date and Time cannot be in the future',
      ]
    },

    timeRules() {
      return [
        v => !!v || 'A time is required',
        v =>
          (v &&
            dateNotInFuture(
              this.model.stopDate.date,
              this.model.stopDate.time,
            )) ||
          'Date and Time cannot be in the future',
      ]
    },

    durationRules() {
      return [
        v => !!v || 'A duration is required',
        v =>
          (v >= 1 && v <= 1440) ||
          'Duration must be between 1 and 1440 minutes',
      ]
    },

    lateExplanationRules() {
      return [
        v =>
          !this.isLateStop ||
          (v && v.length > 4) ||
          'Explanation is required for late stops',
      ]
    },

    isValidDateTime() {
      const dateStr = this.model.stopDate.date
      const timeStr = this.model.stopDate.time

      if (!this.isAdminEditing) {
        return (
          dateWithinLastHours(dateStr, timeStr, 24) &&
          dateNotInFuture(dateStr, timeStr)
        )
      }
      return dateNotInFuture(dateStr, timeStr)
    },

    getMinDate() {
      return formatToIsoDate(new Date(2018, 1, 1, 0, 0, 0))
    },

    getMaxDate() {
      return formatToIsoCurrentDate()
    },
  },

  methods: {
    handleDevTime() {
      this.devTime = !this.devTime

      if (this.devTime) {
        this.model.stopVersion = 2
      } else if (!this.devTime) {
        this.model.stopVersion = 1
      }

      this.$emit('on-dev-time')
    },
  },

  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
    },
    isLateStop: {
      handler: function (newVal) {
        this.model.isLateSubmission = newVal
      },
      immediate: true,
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
