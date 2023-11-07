<template>
  <v-select
    v-model="model"
    clearable
    flat
    :disabled="disabled"
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    required
    :items="items"
    :rules="rules"
    validate-on-blur
    :chips="chips"
    :multiple="multiple"
  ></v-select>
</template>

<script>
export default {
  name: 'ripa-select',

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
      type: [String, Number, Array],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemText: {
      type: String,
      default: '',
    },
    itemValue: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    chips: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
