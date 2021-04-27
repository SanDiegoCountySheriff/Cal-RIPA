<template>
  <v-switch v-model="model" :label="label"> </v-switch>
</template>

<script>
export default {
  name: 'ripa-switch',

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
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: 'no',
    },
  },
}
</script>
