<template>
  <v-checkbox
    v-model="model"
    :disabled="disabled"
    :label="label"
    :rules="rules"
    :hide-details="hideDetails"
    validate-on-blur
  ></v-checkbox>
</template>

<script>
export default {
  name: 'ripa-checkbox',

  data() {
    return {
      viewModel: this.value,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        this.viewModel = newVal
        this.$emit('input', newVal)
      },
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
