<template>
  <div :class="['ripa-app-bar', getAppBarBackgroundClass]">
    <v-app-bar app dense flat>
      <v-toolbar-title class="tw-cursor-pointer" @click="$router.push('/')">{{
        getAppTitle
      }}</v-toolbar-title>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            aria-label="Online indicator"
            class="tw-ml-4"
            size="22"
            v-bind="attrs"
            v-on="on"
            >{{ getOnlineIcon }}</v-icon
          >
        </template>
        <span>Online Status</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            aria-label="Change dark/light mode"
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

      <template v-if="isMobile">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <v-btn icon @click="handleViewStopsWithErrors">
              <v-icon v-show="$vuetify.breakpoint.xs" color="error">mdi-alert</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-show="!$vuetify.breakpoint.xs">
              <v-list-item-title>
                <v-btn
                  aria-label="View stops with errors"
                  small
                  text
                  @click="handleViewStopsWithErrors"
                >
                  <v-icon class="tw-mr-4" color="error"> mdi-alert </v-icon>
                  View stops with errors
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <template v-if="authenticated && online">
              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    aria-label="View last 10 officer stops"
                    small
                    text
                    to="/stops"
                  >
                    <v-icon class="tw-mr-4">
                      mdi-numeric-10-box-multiple-outline
                    </v-icon>
                    Last 10 Stops
                  </v-btn>
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    aria-label="View user profile"
                    small
                    text
                    @click="handleUserChange"
                  >
                    <v-icon class="tw-mr-4"> mdi-account-edit </v-icon>
                    View user profile
                  </v-btn>
                </v-list-item-title>
              </v-list-item>

              <template v-if="admin">
                <v-list-item>
                  <v-list-item-title>
                    <v-btn small text to="/admin">
                      <v-icon aria-label="Manage admin tables" class="tw-mr-4">
                        mdi-cog
                      </v-icon>
                      Manage admin tables
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    aria-label="Logout of application"
                    small
                    text
                    @click="handleAuth"
                  >
                    <v-icon class="tw-mr-4"> mdi-logout-variant </v-icon>
                    Logout
                  </v-btn>
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>

      <template v-if="!isMobile">
        <div v-if="!invalidUser">
          <v-tooltip v-if="stopsWithErrors.length > 0" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="tw-ml-4"
                icon
                small
                @click="handleViewStopsWithErrors"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-alert</v-icon>
              </v-btn>
            </template>
            <span>View stops with errors</span>
          </v-tooltip>

          <v-tooltip v-if="authenticated && online" bottom>
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

          <v-tooltip v-if="authenticated && online" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="tw-ml-4"
                icon
                small
                @click="handleUserChange"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-account-edit</v-icon>
              </v-btn>
            </template>
            <span>View user profile</span>
          </v-tooltip>

          <template v-if="authenticated && online && admin">
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

          <v-tooltip v-if="authenticated && online" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="tw-ml-4"
                icon
                small
                @click="handleAuth"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-logout-variant</v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </div>
      </template>
    </v-app-bar>

    <v-banner v-if="!authenticated && online" single-line :sticky="true">
      You are not logged in. While you can initiate a new stop, you must be
      logged in to submit it.
      <template v-slot:actions>
        <v-btn
          color="primary"
          @click="handleLogIn"
          class="tw-mr-4 tw-mt-4 sm:tw-mt-0"
          >Login</v-btn
        >
      </template>
    </v-banner>
  </div>
</template>

<script>
export default {
  name: 'ripa-app-bar',

  data() {
    return {
      isMobile: false,
    }
  },

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
      switch (this.environmentName) {
        case 'DEV':
          return 'RIPA (DEV)'
        case 'QA':
          return 'RIPA (QA)'

        default:
          return 'RIPA'
      }
    },

    getAdmin() {
      return this.admin
    },

    getOnlineIcon() {
      return this.online ? 'mdi-wifi' : 'mdi-wifi-strength-off'
    },

    getAppBarBackgroundClass() {
      switch (this.environmentName) {
        case 'DEV':
          return this.$vuetify.theme.dark
            ? 'ripa-app-bar--dev-dark'
            : 'ripa-app-bar--dev-light'
        case 'QA':
          return this.$vuetify.theme.dark
            ? 'ripa-app-bar--qa-dark'
            : 'ripa-app-bar--qa-light'

        default:
          return ''
      }
    },
  },

  methods: {
    handleViewStopsWithErrors() {
      if (this.onViewStopsWithErrors) {
        this.onViewStopsWithErrors()
      }
    },

    handleThemeChange() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (this.onUpdateDark) {
        this.onUpdateDark(this.$vuetify.theme.dark)
      }
    },

    handleAuth() {
      if (this.authenticated) {
        this.handleLogOut()
      } else {
        this.handleLogIn()
      }
    },

    handleLogOut() {
      this.$emit('handleLogOut')
    },

    handleLogIn() {
      this.$emit('handleLogIn')
    },

    handleUserChange() {
      if (this.onUpdateUser) {
        this.onUpdateUser()
      }
    },

    handleResize() {
      this.isMobile = window.innerWidth < 600
    },
  },

  mounted() {
    this.$vuetify.theme.dark = this.dark
    this.handleResize()

    window.addEventListener('resize', this.handleResize, { passive: true })
  },

  beforeDestroy() {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.handleResize, { passive: true })
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
    environmentName: {
      type: String,
      default: '',
    },
    online: {
      type: Boolean,
      default: false,
    },
    onUpdateDark: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
    onViewStopsWithErrors: {
      type: Function,
      default: () => {},
    },
    invalidUser: {
      type: Boolean,
      default: false,
    },
    authenticated: {
      type: Boolean,
      default: false,
    },
    stopsWithErrors: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.ripa-app-bar {
  .v-btn:before {
    background-color: inherit !important;
  }
}

.ripa-app-bar--dev-dark {
  .theme--dark.v-app-bar.v-toolbar.v-sheet {
    background-color: #006600;
  }
}
.ripa-app-bar--dev-light {
  .theme--light.v-app-bar.v-toolbar.v-sheet {
    background-color: #90ee90;
  }
}
.ripa-app-bar--qa-dark {
  .theme--dark.v-app-bar.v-toolbar.v-sheet {
    background-color: #1976d2;
  }
}
.ripa-app-bar--qa-light {
  .theme--light.v-app-bar.v-toolbar.v-sheet {
    background-color: #90caf9;
  }
}
</style>
