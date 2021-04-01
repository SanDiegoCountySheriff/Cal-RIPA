<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          :src="require('@/assets/logo.png')"
          :width="30"
          :height="30"
          contain
        />
      </div>

      <v-spacer></v-spacer>

      <v-switch color="white" v-model="$vuetify.theme.dark" />
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
}
</script>
