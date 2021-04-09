<template>
  <v-app-bar flat>
    <v-toolbar-title>RIPA</v-toolbar-title>

    <v-btn class="tw-ml-4" small icon @click="handleThemeChange">
      <v-icon>{{ getThemeIcon }}</v-icon>
    </v-btn>

    <v-spacer></v-spacer>

    <div>
      <v-btn class="tw-ml-4" small icon>
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>

      <v-btn class="tw-ml-4" small icon>
        <v-icon>mdi-numeric-10-box-multiple-outline</v-icon>
      </v-btn>

      <v-btn class="tw-ml-4" small icon>
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>

      <v-btn class="tw-ml-4" small icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'ripa-app-bar',

  computed: {
    getThemeIcon() {
      return this.$vuetify.theme.dark
        ? 'mdi-white-balance-sunny'
        : 'mdi-moon-first-quarter'
    },
  },

  methods: {
    handleThemeChange() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  },

  created() {
    this.$vuetify.theme.dark = false
  },
}
</script>
