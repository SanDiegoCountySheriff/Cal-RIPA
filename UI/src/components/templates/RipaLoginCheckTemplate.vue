<template>
  <v-card class="mx-auto my-12" max-width="600">
    <v-card-title class="tw-uppercase">Ripa stops</v-card-title>

    <v-card-text>
      <div>
        Attempting to log in:
        <p>If you are not redirected in a few seconds, click here.</p>
      </div>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import AuthService from '../../services/auth'

export default {
  name: 'ripa-login-check-template',

  computed: {
    ...mapGetters(['isAuthConfigSet']),
    ...mapGetters(['user']),
  },

  methods: {
    ...mapActions(['setAuthConfig']),
    ...mapActions(['setUserAccountInfo']),
  },

  async created() {
    console.log('from auth template: ' + this.user.isLoggedIn)
    if (!this.user.isLoggedIn) {
      // if the auth config isn't set, dispatch action to get it
      const authConfigResponse = await AuthService.getAuthConfig()
      if (authConfigResponse) {
        // set the auth config in store
        this.setAuthConfig(true)
        const userAccount = await AuthService.tryLogin()
        this.setUserAccountInfo(userAccount)
        // redirect to home page
        this.$router.push('/')
      } else {
        this.$router.next()
      }
    }
  },
}
</script>
