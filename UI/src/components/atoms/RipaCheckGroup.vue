<template>
  <div class="ripa-check-group">
    <v-checkbox
      v-for="(item, index) in checkBoxItems"
      :key="index"
      v-model="model"
      :disabled="disabled || item.disabled || false"
      :label="item.name"
      :value="item.value"
      :rules="rules"
      :hide-details="index < checkBoxItems.length - 1"
      validate-on-blur
      multiple
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ripa-check-group',

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    checkBoxItems() {
      return this.items
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
