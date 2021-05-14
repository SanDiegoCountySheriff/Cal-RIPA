<template>
  <div v-if="isVisible">
    <v-text-field
      ref="ripaTextInput"
      :value="viewModel"
      :label="label"
      :loading="loading"
      :hint="hint"
      :rules="rules"
      validate-on-blur
      @input="debounceInput"
    ></v-text-field>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ripa-text-input',

  data() {
    return {
      isVisible: true,
      viewModel: this.value,
    }
  },

  methods: {
    debounceInput: _.debounce(function (e) {
      this.parseText(e)
    }, 1000),

    parseText(newVal) {
      this.isVisible = false
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
        this.isVisible = true
      })
    },
  },

  watch: {
    value(newVal) {
      console.log('watch')
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
