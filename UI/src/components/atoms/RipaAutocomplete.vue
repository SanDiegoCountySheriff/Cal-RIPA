<template>
  <v-autocomplete
    v-model="model"
    clearable
    dense
    flat
    :hint="hint"
    :persistent-hint="persistentHint"
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    :items="items"
    :disabled="disabled"
  ></v-autocomplete>
</template>

<script>
export default {
  name: 'ripa-autocomplete',

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
      type: [String, Number],
      default: null,
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
    persistentHint: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
