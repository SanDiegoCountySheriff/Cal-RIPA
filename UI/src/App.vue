<template>
  <v-app>
    <v-main fluid>
      <ripa-page-container>
        <router-view :key="$route.fullPath" />
      </ripa-page-container>
    </v-main>
  </v-app>
</template>

<script>
import RipaPageContainer from '@/components/features/RipaPageContainer'

export default {
  name: 'App',

  components: {
    RipaPageContainer,
  },

  data: () => ({
    //
  }),
}
</script>
