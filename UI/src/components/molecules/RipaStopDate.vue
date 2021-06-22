<template>
  <div class="ripa-stop-date tw-pb-4">
    <ripa-form-header
      title="Date of Stop"
      required
      subtitle="§999.226(a)(2)"
      :on-open-statute="onOpenStatute"
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
              :disabled="isStopDateDisabled"
              @input="handleInput"
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
              :disabled="isStopDateDisabled"
              @input="handleInput"
            >
            </ripa-time-picker>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="4">
          <div class="md:tw-mr-4">
            <ripa-number-input
              v-model="model.stopDate.duration"
              label="Stop Duration"
              hint="Duration of Stop should be defined in minutes. Maximum of 1440."
              :min="1"
              :max="1440"
              :rules="durationRules"
              @input="handleInput"
            >
            </ripa-number-input>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.stopDate.stopInResponseToCfs"
            label="Stop in response to Call for Service"
            :max-width="300"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import { DURATIONS } from '@/constants/form'
import { dateWithinLastHours, dateNotInFuture } from '@/utilities/dates'

export default {
  name: 'ripa-stop-date',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaDatePicker,
    RipaNumberInput,
    RipaSwitch,
    RipaTimePicker,
  },

  data() {
    return {
      durationItems: DURATIONS,
      dateRules: [
        v => !!v || 'A date is required',
        v =>
          this.adminEditing ||
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
      ],
      timeRules: [
        v => !!v || 'A time is required',
        v =>
          this.adminEditing ||
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
      ],
      durationRules: [
        v => !!v || 'A duration is required',
        v =>
          (v >= 1 && v <= 1440) ||
          'Duration must be between 1 and 1440 minutes',
      ],
      viewModel: this.updateModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    isStopDateDisabled() {
      return this.adminEditing
    },

    isValidDateTime() {
      const dateStr = this.viewModel.stopDate.date
      const timeStr = this.viewModel.stopDate.time

      return (
        dateWithinLastHours(dateStr, timeStr, 24) &&
        dateNotInFuture(dateStr, timeStr)
      )
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
