<template>
  <v-textarea
    v-model="model"
    auto-grow
    clearable
    clear-icon="mdi-close-circle"
    counter
    flat
    :hint="hint"
    :label="label"
    required
    rows="1"
    :rules="rules"
  ></v-textarea>
</template>

<script>
export default {
  name: 'ripa-text-area',

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
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
