<template>
    <v-switch
     v-model="model"
     :items="items"
     :label="label">
      </v-switch>
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

    items: {
      type: Object,
      default: {},
    },

    label: {
      type: String,
      default: string,
    }
    
  }
}
</script>
