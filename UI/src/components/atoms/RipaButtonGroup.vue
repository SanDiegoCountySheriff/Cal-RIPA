<template>
  <div class="ripa-radio-group">
    <v-btn-toggle v-model="model" tile color="primary" group>
      <v-btn v-for="(item, index) in items" :key="index" :value="item.value">
        {{ item.name }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  name: 'ripa-button-group',

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
      type: [Number, String],
      default: '',
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

<style lang="scss">
.btn-toggle {
  flex-direction: column;
}
</style>
