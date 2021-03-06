<template>
  <v-app-bar app dense flat>
    <v-toolbar-title
      v-if="!invalidUser"
      class="tw-cursor-pointer"
      @click="$router.push('/')"
      >{{ getAppTitle }}</v-toolbar-title
    >

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon class="tw-ml-4" size="22" v-bind="attrs" v-on="on">{{
          getOnlineIcon
        }}</v-icon>
      </template>
      <span>Online Status</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="tw-ml-4"
          icon
          small
          @click="handleThemeChange"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>{{ getThemeIcon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ getThemeTooltip }}</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <div v-if="!invalidUser">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="tw-ml-4"
            icon
            small
            to="/stops"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-numeric-10-box-multiple-outline</v-icon>
          </v-btn>
        </template>
        <span>View last 10 stops</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="tw-ml-4" icon small to="/user" v-bind="attrs" v-on="on">
            <v-icon>mdi-account-edit</v-icon>
          </v-btn>
        </template>
        <span>View user profile</span>
      </v-tooltip>

      <template v-if="admin">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="tw-ml-4"
              icon
              small
              to="/admin"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <span>Manage admin tables</span>
        </v-tooltip>
      </template>
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

    getThemeTooltip() {
      return this.$vuetify.theme.dark ? 'View light mode' : 'View dark mode'
    },

    getAppTitle() {
      return 'RIPA'
    },

    getAdmin() {
      return this.admin
    },

    getOnlineIcon() {
      return this.online ? 'mdi-wifi' : 'mdi-wifi-strength-off'
    },
  },

  methods: {
    handleThemeChange() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (this.onUpdateDark) {
        this.onUpdateDark(this.$vuetify.theme.dark)
      }
    },
  },

  mounted() {
    this.$vuetify.theme.dark = this.dark
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    onUpdateDark: {
      type: Function,
      default: () => {},
    },
    invalidUser: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.v-btn:before {
  background-color: inherit !important;
}
</style>
