<template>
  <div class="ripa-stop-date tw-p-4">
    <ripa-form-header title="Date of Stop" required subtitle="§999.226(a)(10)">
    </ripa-form-header>

    <ripa-date-picker
      v-model="model.datePicker"
      label="Date of Stop"
      @input="handleInput"
    >
    </ripa-date-picker>

    <ripa-time-picker
      v-model="model.timePicker"
      label="Time of Stop"
      @input="handleInput"
    >
    </ripa-time-picker>

    <ripa-number-input
      v-model="model.duration"
      label="Stop Duration"
      @input="handleInput"
    >
    </ripa-number-input>

    <ripa-checkbox
      v-model="model.checkbox"
      cbLabel="Stop in response to Call for Service"
      @input="handleInput"
    >
    </ripa-checkbox>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import { format } from 'date-fns'

export default {
  name: 'ripa-stop-date',

  components: {
    RipaFormHeader,
    RipaCheckbox,
    RipaDatePicker,
    RipaTimePicker,
    RipaNumberInput,
  },

  data() {
    return {
      valid: true,
      viewModel: {
        duration: this.value?.duration || null,
        checkbox: this.value?.checkbox || false,
        datePicker: format(new Date(), 'yyyy-MM-dd'),
        timePicker: format(new Date(), 'h:mm'),
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
