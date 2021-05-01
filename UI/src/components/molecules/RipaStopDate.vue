<template>
  <div class="ripa-stop-date tw-pb-8">
    <ripa-form-header title="Date of Stop" required subtitle="§999.226(a)(10)">
    </ripa-form-header>

    <ripa-date-picker
      v-model="model.stopDate.date"
      label="Date of Stop"
      @input="handleInput"
    >
    </ripa-date-picker>

    <ripa-time-picker
      v-model="model.stopDate.time"
      label="Time of Stop"
      @input="handleInput"
    >
    </ripa-time-picker>

    <ripa-select
      v-model="model.stopDate.duration"
      label="Stop Duration"
      :items="durationItems"
      itemText="name"
      itemValue="value"
      @input="handleInput"
    >
    </ripa-select>

    <ripa-switch
      v-model="model.stopDate.stopInResponseToCfs"
      label="Stop in response to Call for Service"
      :max-width="300"
      @input="handleInput"
    ></ripa-switch>
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
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
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
