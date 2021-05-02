<template>
  <v-autocomplete
    class="tw-my-6"
    v-model="model"
    clearable
    dense
    flat
    :hint="hint"
    :persistent-hint="persistentHint"
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    :items="getItems"
    :disabled="disabled"
    :chips="chips"
    :small-chips="smallChips"
    :deletable-chips="deletableChips"
    :multiple="multiple"
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

    getItems() {
      if (this.multiple && this.viewModel.length === this.maxSelections) {
        return this.items.filter(item => this.viewModel.includes(item.code))
      }

      return this.items
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
    chips: {
      type: Boolean,
      default: false,
    },
    smallChips: {
      type: Boolean,
      default: false,
    },
    deletableChips: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxSelections: {
      type: Number,
      default: 5,
    },
  },
}
</script>
