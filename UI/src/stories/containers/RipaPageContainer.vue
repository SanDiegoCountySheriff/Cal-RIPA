<template>
  <ripa-page-wrapper :admin="admin">
    <slot></slot>
  </ripa-page-wrapper>
</template>

<script>
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'

export default {
  name: 'ripa-page-container',

  components: {
    RipaPageWrapper,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
