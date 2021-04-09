<template>
  <div>
    <ripa-app-bar></ripa-app-bar>
    <ripa-content-wrapper>
      <slot></slot>
    </ripa-content-wrapper>
  </div>
</template>

<script>
import RipaAppBar from '@/components/molecules/RipaAppBar'
import RipaContentWrapper from '@/components/organisms/RipaContentWrapper'

export default {
  name: 'ripa-page-wrapper',

  components: {
    RipaAppBar,
    RipaContentWrapper,
  },
}
</script>
