<template>
  <v-autocomplete
    v-model="model"
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
    class="tw-my-4"
    validate-on-blur
    clearable
    flat
    ><template v-if="customChip" v-slot:selection="data">
      <v-chip
        :color="getCustomChipColor(data)"
        :input-value="data.selected"
        @click:close="handleRemoveItem(data)"
        v-bind="data.attrs"
        close
        small
      >
        <v-tooltip
          v-if="getCustomChipColor(data) === 'error'"
          color="error"
          bottom
        >
          <template #activator="{ on }">
            <v-icon v-on="on">mdi-alert</v-icon>
          </template>
          <span>Statute Expired</span>
        </v-tooltip>
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

  inject: ['filteredStatutes'],

  methods: {
    handleRemoveItem(data) {
      this.$emit('remove-item', data)
    },

    getCustomChipLabel(data) {
      return data.item.fullName.split('-')[0]
    },

    getCustomChipColor(data) {
      return this.filteredStatutes.find(s => s.code === data.item.code)
        ?.repealed
        ? 'error'
        : ''
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
