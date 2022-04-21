<template>
  <v-autocomplete
    class="tw-my-4"
    v-model="model"
    clearable
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
    :rules="rules"
    validate-on-blur
    ><template v-if="customChip" v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        small
        @click:close="handleRemoveItem(data)"
      >
        {{ getCustomChipLabel(data) }}
      </v-chip>
    </template></v-autocomplete
  >
</template>

<script>
export default {
  name: 'ripa-autocomplete',

  data() {
    return {
      viewModel: this.value,
    }
  },

  methods: {
    handleRemoveItem(data) {
      this.$emit('remove-item', data)
    },

    getCustomChipLabel(data) {
      if (this.customChipLabel) {
        return this.customChipLabel(data)
      }
      return ''
    },
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
      if (
        this.multiple &&
        this.viewModel &&
        this.viewModel.length === this.maxSelections
      ) {
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
    customChip: {
      type: Boolean,
      default: false,
    },
    customChipLabel: {
      type: Function,
      default: () => {},
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
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
