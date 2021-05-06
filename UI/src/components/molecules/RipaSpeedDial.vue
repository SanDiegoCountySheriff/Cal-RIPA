<template>
  <v-speed-dial
    class="ripa-speed-dial"
    v-model="fab"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :direction="direction"
    :open-on-hover="hover"
    :transition="transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="primary darken-2" dark fab>
        <v-icon v-if="fab"> mdi-close </v-icon>
        <v-icon v-else> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small color="primary darken-2">
      <v-icon>mdi-numeric-10-box-multiple-outline</v-icon>
    </v-btn>
    <v-btn fab dark small color="primary darken-2">
      <v-icon>mdi-account-edit</v-icon>
    </v-btn>
    <v-btn fab dark small color="primary darken-2">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'ripa-speed-dial',

  data() {
    return {
      direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
    }
  },
}
</script>

<style lang="scss">
.ripa-speed-dial {
  position: fixed !important;
}
</style>
