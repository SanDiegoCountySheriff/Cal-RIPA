<template>
  <div class="ripa-page-wrapper">
    <ripa-app-bar
      :admin="admin"
      :display-environment="displayEnvironment"
      :environment-name="environmentName"
      :online="online"
      :authenticated="authenticated"
      :invalidUser="invalidUser"
      :dark="dark"
      :on-update-dark="onUpdateDark"
      @handleLogOut="handleLogOut"
      @handleLogIn="handleLogIn"
      :on-update-user="onUpdateUser"
    ></ripa-app-bar>

    <ripa-content-wrapper>
      <slot></slot>
    </ripa-content-wrapper>

    <v-footer padless fixed>
      <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} — RIPA — {{ getVersion }}
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import RipaAppBar from '@/components/molecules/RipaAppBar'
import RipaContentWrapper from '@/components/organisms/RipaContentWrapper'
import { VERSION } from '@/constants/app'

export default {
  name: 'ripa-page-wrapper',

  components: {
    RipaAppBar,
    RipaContentWrapper,
  },

  computed: {
    getVersion() {
      return VERSION
    },
  },

  methods: {
    handleLogOut() {
      this.$emit('handleLogOut')
    },
    handleLogIn() {
      this.$emit('handleLogIn')
    },
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
    displayEnvironment: {
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
    invalidUser: {
      type: Boolean,
      default: false,
    },
    authenticated: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 600px) {
  .v-footer {
    max-height: 20px !important;

    .text-center {
      padding: 4px !important;
      font-size: 14px !important;
    }
  }
}
</style>
