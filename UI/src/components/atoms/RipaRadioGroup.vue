<template>
  <div class="ripa-radio-group">
    <v-radio-group :row="displayInRow" v-model="model" :rules="rules">
      <v-radio
        v-for="(item, index) in items"
        :disabled="disabled"
        :key="index"
        :label="item.name"
        :value="item.value"
      ></v-radio>
    </v-radio-group>
    <template v-if="isClearVisible">
      <v-btn
        class="tw-ml-4"
        text
        color="primary"
        x-small
        :disabled="disabled"
        @click="handleClearSelection"
        >Clear selection</v-btn
      >
    </template>
  </div>
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

    isClearVisible() {
      return this.viewModel !== null && this.clearSelection
    },

    displayInRow() {
      if (this.$vuetify.breakpoint.xs) {
        return false
      }
      return this.displayRow
    },
  },

  methods: {
    handleClearSelection() {
      this.model = null
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
    clearSelection: {
      type: Boolean,
      default: false,
    },
    displayRow: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.ripa-radio-group {
  display: inline-block;
}
</style>
