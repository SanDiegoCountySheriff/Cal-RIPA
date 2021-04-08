<template>
  <v-app-bar absolute elevate-on-scroll dense>
    <v-toolbar-title>RIPA</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-plus-box</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-numeric-10-box-multiple-outline</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-account-edit</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <v-switch
      class="tw-ml-4"
      color="white"
      v-model="$vuetify.theme.dark"
      hide-details
      dense
    />
  </v-app-bar>
</template>

<script>
export default {
  name: 'ripa-app-bar',
}
</script>
