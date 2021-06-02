<template>
  <div class="ripa-check-group">
    <v-checkbox
      v-for="(item, index) in items"
      :key="index"
      v-model="model"
      :disabled="disabled || item.disabled || false"
      :label="item.name"
      :value="item.value"
      :rules="rules"
      :hide-details="index < items.length - 1"
      validate-on-blur
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ripa-check-group',

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
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
