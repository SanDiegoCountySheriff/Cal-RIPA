<template>
  <v-radio-group v-model="model" hide-details>
    <v-radio
      v-for="(item, index) in items"
      :key="index"
      :label="item.name"
      :value="item.value"
    ></v-radio>
  </v-radio-group>
</template>

<script>
export default {
  name: 'ripa-radio-group',

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
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
