<template>
  <v-form ref="step2" lazy-validation>
    <ripa-student
      v-model="model.student"
      @input="handleInput"
      toggle
    ></ripa-student>
    <v-spacer></v-spacer>

    <template v-if="!isValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-4" @click="back">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-4" @click="cancel">
        Cancel
      </v-btn>
      <v-btn color="primary" class="tw-mr-4" @click="next"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaStudent from '@/components/molecules/RipaStudent'

export default {
  name: 'ripa-form-step2',

  components: { RipaStudent },

  data() {
    return {
      isValid: true,
      viewModel: {
        student: this.value?.student || null,
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

    back() {
      if (this.onBack) {
        this.onBack()
      }
    },

    next() {
      this.isValid = this.$refs.step2.validate()
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
    onBack: {
      type: Function,
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
