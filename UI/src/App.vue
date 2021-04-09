<template>
  <v-app>
    <v-main fluid>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
