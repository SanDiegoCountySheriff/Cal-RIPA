<template>
  <v-text-field
    v-model="model"
    :label="label"
    :loading="loading"
    :hint="hint"
    :rules="rules"
    validate-on-blur
  ></v-text-field>
</template>

<script>
export default {
  name: 'ripa-text-input',

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
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
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
