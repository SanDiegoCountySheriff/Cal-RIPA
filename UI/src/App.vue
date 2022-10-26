<template>
  <v-app>
    <v-main fluid>
      <ripa-page-container :view-stops-with-errors="viewStopsWithErrors">
        <vue-confirm-dialog></vue-confirm-dialog>
        <ripa-pwa-wrapper></ripa-pwa-wrapper>
        <router-view
          :key="$route.fullPath"
          @on-view-stops-with-errors="handleViewStopsWithErrors"
        />
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

  data() {
    return {
      viewStopsWithErrors: false,
    }
  },

  methods: {
    handleViewStopsWithErrors() {
      this.viewStopsWithErrors = true
    },
  },
}
</script>
