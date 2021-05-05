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
    :persistent-hint="persistentHint"
    required
    rows="1"
    :rules="rules"
    :loading="loading"
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
    persistentHint: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
