<template>
  <ripa-user-wrapper :value="officer" @input="onUpdate"></ripa-user-wrapper>
</template>

<script>
import RipaUserWrapper from '@/components/organisms/RipaUserWrapper'

export default {
  name: 'ripa-user-template',

  components: {
    RipaUserWrapper,
  },

  props: {
    officer: {
      type: Object,
      default: () => {},
    },
    onUpdate: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
