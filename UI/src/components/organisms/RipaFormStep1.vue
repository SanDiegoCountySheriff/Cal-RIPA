<template>
  <v-form ref="step1" lazy-validation>
    <ripa-officer
      v-model="model.officer"
      @input="handleInput"
      toggle
    ></ripa-officer>
    <ripa-stop-date v-model="model.stop" @input="handleInput"></ripa-stop-date>
    <ripa-location
      v-model="model.location"
      :schools="schools"
      :beats="beats"
      :cities="cities"
      @input="handleInput"
    ></ripa-location>
    <v-spacer></v-spacer>

    <template v-if="!isValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="error" class="tw-mr-4" @click="cancel">
        Cancel
      </v-btn>
      <v-btn color="primary" class="tw-mr-4" @click="submit"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaOfficer from '@/components/molecules/RipaOfficer'
import RipaStopDate from '@/components/molecules/RipaStopDate'
import RipaLocation from '@/components/molecules/RipaLocation'

export default {
  name: 'ripa-form-step1',

  components: { RipaOfficer, RipaStopDate, RipaLocation },

  data() {
    return {
      isValid: true,
      viewModel: {
        officer: this.value?.officer || null,
        stop: this.value?.stop || null,
        location: this.value?.location || null,
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

    submit() {
      this.isValid = this.$refs.step1.validate()
      if (!this.isValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onNext) {
        this.onNext()
      }
    },

    cancel() {
      if (this.onCancel) {
        this.onCancel()
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    schools: {
      type: Array,
      default: () => {},
    },
    beats: {
      type: Array,
      default: () => {},
    },
    cities: {
      type: Array,
      default: () => {},
    },
    onNext: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
