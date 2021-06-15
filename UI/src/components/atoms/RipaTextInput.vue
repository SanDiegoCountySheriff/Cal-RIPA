<template>
  <v-text-field
    ref="ripaTextInput"
    v-model="viewModel"
    :label="label"
    :loading="loading"
    :hint="hint"
    :rules="rules"
    :disabled="disabled"
    @blur="handleBlur"
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

  methods: {
    handleBlur(event) {
      this.viewModel = this.parseText(event.target.value)
      this.handleInput(this.viewModel)
    },

    parseText(newVal) {
      const currentText = newVal || ''
      const parsedText = currentText
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          '',
        )
        .trim()
      return parsedText
    },

    handleInput(newVal) {
      this.$nextTick(() => {
        this.viewModel = newVal
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
