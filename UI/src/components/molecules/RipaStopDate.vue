<template>
  <div class="ripa-stop-date tw-p-4">
    <ripa-form-header
      title="Date of Stop"
      required
      subtitle="§999.226(a)(10)">
    </ripa-form-header>

    <v-checkbox
      v-model="checkbox"
      dense
      cbLabel: "Stop in response to Call for Service"
      cbValue: "Stop in response to Call for Service"
      hide-details>
    </v-checkbox>

    <ripa-date-picker
      v-model="datePicker"
      label="Date of Stop">
    </ripa-date-picker>

    <ripa-time-picker
      v-model="timePicker"
      label="Time of Stop">
    </ripa-time-picker>

    <ripa-number-input
      v-model="duration"
      label= "Stop Duration"
      required>
    </ripa-number-input>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaTimePicker from '@/components/atoms/RipaTimePicker'

export default {
  name: 'ripa-stop-date',

  components: {
    RipaFormHeader,
    RipaCheckbox,
    RipaDatePicker,
    RipaTimePicker,
  },

  data() {
    return {
      valid: true,
      duration: '',
      checkbox: false,
      datePicker: format(new Date(), 'yyyy-MM-dd'),
      timePicker: format(new Date(), 'h:mm'),
    }
  },

  computed: {
    getModel() {
      return {
        duration: this.duration,
        checkbox: this.checkbox,
        explanation: this.explanation,
        datePicker: this.datePicker,
        timePicker: this.timePicker
      }
    },
  },

  methods: {
    submit() {
      this.$emit('input', {
        duration: this.duration,
        checkbox: this.checkbox,
        explanation: this.explanation,
        datePicker: this.datePicker,
        timePicker: this.timePicker
      })
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

