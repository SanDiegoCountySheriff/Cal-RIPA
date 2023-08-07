<template>
  <div class="ripa-stop-date tw-pb-4">
    <ripa-form-header
      title="Date of Stop"
      required
      subtitle="§999.226(a)(2)"
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
        <v-btn @click="handleDevTime" class="ml-3 mb-3" small color="primary">{{
          devTime ? 'Turn Off Dev Time' : 'Turn On Dev Time'
        }}</v-btn>
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
    </v-container>
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
      devTime: false,
    }
  },

  inject: ['isAdminEditing', 'environmentName'],

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        if (new Date(newVal.stopDate.date) >= new Date('2024-01-01')) {
          newVal.stopVersion = 2
          newVal.person.perceivedUnhoused = false
        } else {
          newVal.stopVersion = 1
          newVal.person.perceivedUnhoused = null
        }

        this.$emit('input', newVal)
      },
    },

    dateRules() {
      if (this.devTime) {
        return [v => !!v || 'A date is required']
      }

      return [
        v => !!v || 'A date is required',
        v =>
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
      ]
    },

    timeRules() {
      if (this.devTime) {
        return [v => !!v || 'A time is required']
      }

      return [
        v => !!v || 'A time is required',
        v =>
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
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

    isValidDateTime() {
      const dateStr = this.model.stopDate.date
      const timeStr = this.model.stopDate.time

      if (this.devTime) {
        return true
      }

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
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
