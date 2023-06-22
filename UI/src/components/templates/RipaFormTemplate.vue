<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper v-model="model" v-on="$listeners"></ripa-form-wrapper>
  </div>
</template>

<script>
import RipaFormWrapper from '@/components/organisms/RipaFormWrapper'

export default {
  name: 'ripa-form-template',

  components: {
    RipaFormWrapper,
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
