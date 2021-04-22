<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-autocomplete
        v-model="model"
        clearable
        dense
        flat
        :hint="hint"
        :item-text="itemText"
        :item-value="itemValue"
        :label="label"
        :items="items"
        v-bind="attrs"
        v-on="on"
      ></v-autocomplete>
    </template>
    <span>{{ model }}</span>
  </v-tooltip>
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
    label: {
      type: String,
      default: '',
    },
  },
}
</script>
