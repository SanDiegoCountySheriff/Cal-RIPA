<template>
  <v-app>
    <v-main fluid>
      <ripa-page-container>
        <vue-confirm-dialog></vue-confirm-dialog>
        <ripa-pwa-wrapper></ripa-pwa-wrapper>
        <router-view :key="$route.fullPath" />
      </ripa-page-container>
    </v-main>
  </v-app>
</template>

<script>
import RipaPageContainer from '@/components/features/RipaPageContainer'
import RipaPwaWrapper from '@/components/organisms/RipaPwaWrapper'

export default {
  name: 'App',

  components: {
    RipaPageContainer,
    RipaPwaWrapper,
  },
}
</script>

<style lang="scss">
.v-menu__content {
  max-width: 500px !important;
}
</style>
