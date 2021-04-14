<template>
  <ripa-page-wrapper :admin="isAdmin">
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

  computed: {
    isAdmin() {
      return this.$store.state.isAdmin
    },
  },
}
</script>
