<template>
  <ripa-page-wrapper>
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
}
</script>
