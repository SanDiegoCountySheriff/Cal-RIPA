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
    :loading="loading"
    :persistent-hint="persistentHint"
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
      timeout: null,
      viewModel: this.value,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.viewModel = newVal
          this.$emit('input', this.viewModel)
        }, 1500)
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
    loading: {
      type: Boolean,
      default: true,
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
  },
}
</script>
