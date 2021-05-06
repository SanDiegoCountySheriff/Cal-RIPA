<template>
  <ripa-intro-wrapper :on-template="onTemplate"></ripa-intro-wrapper>
</template>

<script>
import RipaIntroWrapper from '@/components/organisms/RipaIntroWrapper'

export default {
  name: 'ripa-intro-template',

  components: {
    RipaIntroWrapper,
  },

  props: {
    onTemplate: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
