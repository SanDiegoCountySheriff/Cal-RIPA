<template>
  <div class="ripa-check-group">
    <ripa-checkbox
      v-for="(item, index) in items"
      v-model="model"
      :key="index"
      :cb-label="item.name"
      :cb-value="item.value"
    ></ripa-checkbox>
  </div>
</template>

<script>
import RipaCheckbox from '@/components/atoms/RipaCheckbox'

export default {
  name: 'ripa-check-group',

  components: {
    RipaCheckbox,
  },

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
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
