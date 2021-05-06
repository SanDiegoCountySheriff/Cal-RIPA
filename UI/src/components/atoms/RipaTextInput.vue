<template>
  <v-text-field
    v-model="model"
    :label="label"
    :hint="hint"
    :rules="rules"
  ></v-text-field>
</template>

<script>
export default {
  name: 'ripa-text-input',

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
      default: null,
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
