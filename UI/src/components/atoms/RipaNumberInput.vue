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
    @blur="handleBlur"
    @keypress="handleKeyPress"
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

  methods: {
    handleKeyPress(event) {
      const charCode = event.which ? event.which : event.keyCode
      if (charCode < 48 || charCode > 57) {
        event.preventDefault()
      } else {
        return true
      }
    },

    handleBlur(event) {
      this.viewModel = event.target.value
      this.handleInput(this.viewModel)
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
