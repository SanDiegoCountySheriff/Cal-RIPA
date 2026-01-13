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
            {{ lateStopMessage }}
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

    maxBackdateDays() {
      const configValue = this.$store.state.apiConfig?.MaxBackdateDays

      if (configValue === undefined || configValue === null) {
        return 0
      }

      const days = parseInt(configValue, 10)
      return isNaN(days) ? 0 : Math.min(Math.max(days, 0), 30)
    },

    isLateStop() {
      const dateStr = this.model.stopDate.date
      const timeStr = this.model.stopDate.time

      if (!dateStr || !timeStr || this.isAdminEditing) {
        return false
      }

      if (this.maxBackdateDays === 0) {
        return false
      }

      const stopDateTime = new Date(`${dateStr}T${timeStr}`)
      const now = new Date()
      const diffMilliseconds = now.getTime() - stopDateTime.getTime()
      const diffHours = diffMilliseconds / (1000 * 60 * 60)
      const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24))

      return diffHours > 24 && diffDays <= this.maxBackdateDays
    },

    lateStopMessage() {
      if (this.maxBackdateDays === 0) {
        return 'This stop is being submitted more than 24 hours after it occurred. Please provide an explanation for the late submission.'
      }
      return `This stop is being submitted more than ${
        this.maxBackdateDays
      } day${
        this.maxBackdateDays === 1 ? '' : 's'
      } after it occurred. Please provide an explanation for the late submission.`
    },

    dateRules() {
      return [
        v => !!v || 'A date is required',
        v => {
          if (!v) return true
          const selectedYear = parseInt(v.split('-')[0], 10)
          const currentYear = new Date().getFullYear()
          return (
            selectedYear >= currentYear ||
            `Date cannot be before ${currentYear}`
          )
        },
        v =>
          (v &&
            dateNotInFuture(
              this.model.stopDate.date,
              this.model.stopDate.time,
            )) ||
          'Date and Time cannot be in the future',
        v => {
          if (!v || this.isAdminEditing) return true

          const stopDateTime = new Date(
            `${this.model.stopDate.date}T${this.model.stopDate.time}`,
          )
          const now = new Date()
          const diffMilliseconds = now.getTime() - stopDateTime.getTime()
          const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24))

          if (this.maxBackdateDays === 0) {
            return (
              (v && this.isValidDateTime) ||
              'Date and Time must be within the past 24 hours'
            )
          } else {
            return (
              diffDays <= this.maxBackdateDays ||
              `Date and Time cannot be more than ${this.maxBackdateDays} day${
                this.maxBackdateDays === 1 ? '' : 's'
              } in the past`
            )
          }
        },
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
      const maxDays =
        this.maxBackdateDays === 0
          ? '24 hours'
          : `${this.maxBackdateDays} day${
              this.maxBackdateDays === 1 ? '' : 's'
            }`
      return [
        v =>
          !this.isLateStop ||
          (v && v.length > 4) ||
          `Explanation is required for stops submitted more than ${maxDays} after they occurred`,
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
      const now = new Date()
      return formatToIsoDate(new Date(now.getFullYear(), 0, 1, 0, 0, 0))
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
