<template>
  <v-text-field
    :value="viewModel"
    type="number"
    inputmode="numeric"
    :label="label"
    :hint="hint"
    :rules="rules"
    :min="1"
    validate-on-blur
    :disabled="disabled"
    @input="debounceInput"
    @keypress="handleKeyPress"
  ></v-text-field>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ripa-number-input',

  data() {
    return {
      viewModel: this.value,
    }
  },

  methods: {
    debounceInput: _.debounce(function (e) {
      this.parseNumber(e)
    }, 1000),

    handleKeyPress(event) {
      const charCode = event.which ? event.which : event.keyCode
      if (charCode < 48 || charCode > 57) {
        event.preventDefault()
      } else {
        return true
      }
    },

    parseNumber(newVal) {
      this.handleInput(newVal)
    },

    handleInput(newVal) {
      this.$nextTick(() => {
        this.viewModel = Number(newVal)
        this.$emit('input', this.viewModel)
      })
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
    disabled: {
      type: Boolean,
      default: false,
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
