<template>
  <v-form ref="step5" lazy-validation>
    <div>REVIEW FORM SELECTIONS</div>
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
      <v-btn color="primary" class="tw-mr-4" @click="submit"> Submit </v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  name: 'ripa-form-step5',

  data() {
    return {
      isValid: true,
      viewModel: {
        actionsTaken: this.value?.actionsTaken || null,
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

    submit() {
      this.isValid = this.$refs.step5.validate()
      if (!this.isValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onSubmit) {
        this.onSubmit()
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
    onBack: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
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
