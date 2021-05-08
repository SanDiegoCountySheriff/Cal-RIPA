<template>
  <div class="ripa-stop-date tw-pb-8">
    <ripa-form-header title="Date of Stop" required subtitle="§999.226(a)(10)">
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4">
          <div class="md:tw-mr-4">
            <ripa-date-picker
              v-model="model.stopDate.date"
              label="Date of Stop"
              :rules="dateRules"
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
              @input="handleInput"
            >
            </ripa-time-picker>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="4">
          <ripa-select
            v-model="model.stopDate.duration"
            label="Stop Duration"
            :items="durationItems"
            itemText="name"
            itemValue="value"
            :rules="durationRules"
            @input="handleInput"
          >
          </ripa-select>
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
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import { format } from 'date-fns'
import { DURATIONS } from '@/constants/form'
import { dateWithinLastHours } from '@/utilities/dates'

export default {
  name: 'ripa-stop-date',

  components: {
    RipaFormHeader,
    RipaDatePicker,
    RipaSelect,
    RipaSwitch,
    RipaTimePicker,
  },

  data() {
    return {
      valid: true,
      durationItems: DURATIONS,
      dateRules: [
        v => !!v || 'A date is required',
        v =>
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
      ],
      timeRules: [
        v => !!v || 'A time is required',
        v =>
          (v && this.isValidDateTime) ||
          'Date and Time must be within the past 24 hours',
      ],
      durationRules: [v => !!v || 'A duration is required'],
      viewModel: {
        stopDate: {
          date: this.value?.stopDate?.date || format(new Date(), 'yyyy-MM-dd'),
          time: this.value?.stopDate?.time || format(new Date(), 'h:mm'),
          duration: this.value?.stopDate?.duration || null,
          stopInResponseToCfs:
            this.value?.stopDate?.stopInResponseToCfs || false,
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

    isValidDateTime() {
      const dateStr = this.viewModel.stopDate.date
      const timeStr = this.viewModel.stopDate.time
      return dateWithinLastHours(dateStr, timeStr, 24)
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = {
        stopDate: {
          date: newVal?.stopDate?.date || format(new Date(), 'yyyy-MM-dd'),
          time: newVal?.stopDate?.time || format(new Date(), 'h:mm'),
          duration: newVal?.stopDate?.duration || null,
          stopInResponseToCfs: newVal?.stopDate?.stopInResponseToCfs || false,
        },
      }
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
