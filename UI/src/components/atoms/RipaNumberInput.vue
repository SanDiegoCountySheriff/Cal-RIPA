<template>
  <v-text-field
    v-model="model"
    type="number"
    :label="label"
    :hint="hint"
    :rules="rules"
    :min="1"
  ></v-text-field>
</template>

<script>
export default {
  name: 'ripa-number-input',

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
          let updatedValue = newVal
          if (this.roundDown) {
            updatedValue = Math.floor(updatedValue / 100) * 100
          }
          this.viewModel = updatedValue
          this.$emit('input', Number(this.viewModel))
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
    roundDown: {
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

<style lang="scss">
.ripa-number-input input[type='number'] {
  -moz-appearance: textfield;
}

.ripa-number-input input::-webkit-outer-spin-button,
.ripa-number-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
