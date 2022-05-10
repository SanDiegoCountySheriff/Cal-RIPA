<template>
  <div class="test"></div>
</template>

<script>
import RipaModelMixin from '@/components/mixins/RipaModelMixin'

export default {
  name: 'mock-model-component',

  mixins: [RipaModelMixin],

  data() {
    return {
      viewModel: this.syncModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
    },
  },

  props: {
    value: {
      type: Object,
    },
  },
}
</script>
