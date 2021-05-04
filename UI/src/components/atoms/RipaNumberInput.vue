<template>
  <v-text-field
    v-model="model"
    type="number"
    :label="label"
    :hint="hint"
    :rules="rules"
  ></v-text-field>
</template>

<script>
export default {
  name: 'ripa-number-input',

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
        this.$emit('input', Number(newVal))
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
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.ripa-number-input input[type='number'] {
  -moz-appearance: textfield;
}

.ripa-number-input input::-webkit-outer-spin-button,
.ripa-number-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
