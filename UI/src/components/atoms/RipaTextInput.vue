<template>
  <div class="ripa-text-input">
    <template v-if="preventPaste">
      <v-text-field
        ref="ripaTextInput"
        v-model="model"
        :label="label"
        :loading="loading"
        :hint="hint"
        :rules="rules"
        :disabled="disabled"
        @blur="handleBlur"
        @keypress="handleKeyPress"
        @paste.prevent
        @drop="handleDrop($event)"
      ></v-text-field>
    </template>

    <template v-if="!preventPaste">
      <v-text-field
        ref="ripaTextInput"
        v-model="model"
        :label="label"
        :loading="loading"
        :hint="hint"
        :rules="rules"
        :disabled="disabled"
        @blur="handleBlur"
        @keypress="handleKeyPress"
      ></v-text-field>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ripa-text-input',

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },

  methods: {
    handleDrop(event) {
      event.preventDefault()
    },

    handleKeyPress(event) {
      if (this.numbersOnly) {
        const charCode = event.which ? event.which : event.keyCode
        if (charCode < 48 || charCode > 57) {
          event.preventDefault()
        } else {
          return true
        }
      }

      return true
    },

    handleBlur(event) {
      this.model = this.parseText(event.target.value)
      this.$emit('blur', event.target.value)
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
    numbersOnly: {
      type: Boolean,
      default: false,
    },
    preventPaste: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
