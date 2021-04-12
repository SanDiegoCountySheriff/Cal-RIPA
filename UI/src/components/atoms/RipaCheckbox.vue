<template>
  <v-checkbox
    v-model="model"
    dense
    :label="cbLabel"
    :value="cbValue"
    hide-details
  ></v-checkbox>
</template>

<script>
export default {
  name: 'ripa-checkbox',

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
      type: String,
      default: '',
    },
    cbLabel: {
      type: String,
      default: '',
    },
    cbValue: {
      type: String,
      default: '',
    },
  },
}
</script>
