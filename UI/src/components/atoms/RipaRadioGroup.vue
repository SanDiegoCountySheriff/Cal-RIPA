<template>
  <div class="ripa-radio-group">
    <v-radio-group v-model="model" :rules="rules">
      <v-radio
        v-for="(item, index) in items"
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
  },
}
</script>
