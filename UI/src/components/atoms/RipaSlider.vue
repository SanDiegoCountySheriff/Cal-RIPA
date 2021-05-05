<template>
  <v-slider
    v-model="model"
    :label="label"
    :hint="hint"
    :min="min"
    :max="max"
    :rules="rules"
    thumb-label
  ></v-slider>
</template>

<script>
export default {
  name: 'ripa-slider',

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
      type: Number,
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
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 50,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
