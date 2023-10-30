<template>
  <div class="ripa-check-group">
    {{ model }}
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
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ripa-check-group',

  computed: {
    model: {
      get() {
        if (this.name === 'Basis For Search') {
          console.log('model getter from ripa-check-group', this.value)
        }
        return this.value
      },
      set(newVal) {
        if (this.name === 'Basis For Search') {
          console.log('model setter from ripa-check-group', newVal)
          console.log('here is the model', this.model)
        }

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
    name: {
      type: String,
      default: 'None',
    },
  },
}
</script>
