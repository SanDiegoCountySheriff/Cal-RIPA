<template>
  <v-text-field
    ref="ripaTextInput"
    :value="viewModel"
    :label="label"
    :loading="loading"
    :hint="hint"
    :rules="rules"
    :disabled="disabled"
    validate-on-blur
    @input="debounceInput"
    @keypress="handleKeyPress"
    @paste.prevent
  ></v-text-field>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ripa-text-input',

  data() {
    return {
      viewModel: this.value,
    }
  },

  methods: {
    handleKeyPress(event) {
      const charCode = event.which ? event.which : event.keyCode
      const char = String.fromCharCode(charCode)
      if (
        char.match(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])|\s/,
        )
      ) {
        event.preventDefault()
      }
    },

    debounceInput: _.debounce(function (e) {
      this.parseText(e)
    }, 1000),

    parseText(newVal) {
      const currentText = newVal || ''
      const parsedText = currentText
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          '',
        )
        .trim()
      this.handleInput(parsedText)
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
