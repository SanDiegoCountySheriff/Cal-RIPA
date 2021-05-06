<template>
  <ripa-intro :on-template="onTemplate"></ripa-intro>
</template>

<script>
import RipaIntro from '@/components/molecules/RipaIntro'

export default {
  name: 'ripa-intro-wrapper',

  components: {
    RipaIntro,
  },

  props: {
    onTemplate: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
