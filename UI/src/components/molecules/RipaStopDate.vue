<template>
  <div class="ripa-stop-date tw-pb-8">
    <ripa-form-header title="Date of Stop" required subtitle="§999.226(a)(10)">
    </ripa-form-header>

    <ripa-date-picker
      v-model="model.stopDate"
      label="Date of Stop"
      @input="handleInput"
    >
    </ripa-date-picker>

    <ripa-time-picker
      v-model="model.stopTime"
      label="Time of Stop"
      @input="handleInput"
    >
    </ripa-time-picker>

    <ripa-select
      v-model="model.stopDuration"
      label="Stop Duration"
      :items="durationItems"
      itemText="name"
      itemValue="value"
      @input="handleInput"
    >
    </ripa-select>

    <ripa-switch
      v-model="model.stopInResponseToCfs"
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
        stopDate: format(new Date(), 'yyyy-MM-dd'),
        stopTime: format(new Date(), 'h:mm'),
        stopDuration: this.value?.stopDuration || null,
        stopInResponseToCfs: this.value?.stopInResponseToCfs || false,
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
