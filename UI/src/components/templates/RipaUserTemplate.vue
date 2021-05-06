<template>
  <ripa-user-wrapper :value="stop" @input="onUpdate"></ripa-user-wrapper>
</template>

<script>
import RipaUserWrapper from '@/components/organisms/RipaUserWrapper'

export default {
  name: 'ripa-user-template',

  components: {
    RipaUserWrapper,
  },

  props: {
    stop: {
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
