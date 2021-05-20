<template>
  <ripa-page-wrapper
    :admin="isAdmin"
    :online="isOnlineAndAuthenticated"
    :authenticated="isAuthenticated"
    :dark="isDark"
    :invalidUser="invalidUser"
    :on-update-dark="handleUpdateDark"
    @handleLogOut="handleLogOut"
    @handleLogIn="handleLogIn"
  >
    <slot></slot>
    <ripa-interval
      :delay="stopInternalMs"
      @tick="checkLocalStorage"
    ></ripa-interval>
  </ripa-page-wrapper>
</template>

<script>
import RipaInterval from '@/components/atoms/RipaInterval'
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import { mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'
import AuthService from '../../services/auth'

export default {
  name: 'ripa-page-container',

  mixins: [RipaApiStopJobMixin],

  components: {
    RipaInterval,
    RipaPageWrapper,
  },

  data() {
    return {
      isDark: this.getDarkFromLocalStorage(),
      stopInternalMs: 5000,
    }
  },

  computed: {
    ...mapGetters([
      'isAdmin',
      'invalidUser',
      'isOnlineAndAuthenticated',
      'isAuthenticated',
      'apiConfig',
    ]),
  },

  methods: {
    ...mapActions([
      'editOfficerStop',
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'setApiConfig',
    ]),

    async getFormData() {
      this.loading = true
      await Promise.all([
        this.getFormBeats(),
        this.getFormCities(),
        this.getFormSchools(),
        this.getFormStatutes(),
      ])
      this.loading = false
    },

    getDarkFromLocalStorage() {
      const value = localStorage.getItem('ripa_dark_theme')
      if (value === null) {
        return true
      }
      return value === '1'
    },

    handleUpdateDark(value) {
      this.isDark = value
      this.setDarkToLocalStorage()
    },

    handleLogOut() {
      // do logout..will redirect to tenant and then back to page
      AuthService.doLogOut()
    },

    handleLogIn() {
      AuthService.clearManualLogOut()
      AuthService.tryLogin()
    },

    setDarkToLocalStorage() {
      localStorage.setItem('ripa_dark_theme', +this.isDark)
    },

    checkCache() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      if (this.isOnlineAndAuthenticated && cacheDate !== null) {
        const hours = differenceInHours(new Date(), new Date(cacheDate))
        if (hours > 23) {
          this.clearLocalStorage()
        }
      }

      if (cacheDate === null) {
        this.clearLocalStorage()
      }
    },

    clearLocalStorage() {
      localStorage.removeItem('ripa_beats')
      localStorage.removeItem('ripa_county_cities')
      localStorage.removeItem('ripa_non_county_cities')
      localStorage.removeItem('ripa_schools')
      localStorage.removeItem('ripa_statutes')
      localStorage.setItem('ripa_cache_date', new Date())
    },

    async runApiStopsJob(apiStops) {
      if (this.isOnlineAndAuthenticated) {
        for (let index = 0; index < apiStops.length; index++) {
          await this.editOfficerStop(apiStops[index])
        }
      }
    },
  },

  async created() {
    console.log('page container created')
    // check if we have an id token AND it's valid
    // if not
    // IF the user explicity clicked logged out, just redirect to home
    // if not, force user to login
    // if we DO have it, make sure store is updated with values
    if (this.invalidUser) {
      this.$router.push('/checkUser')
    } else {
      this.checkCache()
      const isTokenValid = await AuthService.checkToken()
      console.log('token valid ' + isTokenValid)
      if (!isTokenValid) {
        // if the token ISN'T valid, check to see if the user manually logged out
        const didManualLogOut = AuthService.checkManualLogOut()
        // if they DID manually logout, don't auto try to login again
        // if they did NOT manually logout, auto try the login again
        if (!didManualLogOut) {
          const loginAttempt = await AuthService.tryLogin()
          console.log('login attempt from page container' + loginAttempt)
          if (loginAttempt) {
            // this.getFormData()
          }
        }
      } else {
        console.log('token is valid from page container created')
        // if the token IS valid, clear any log out attempt
        AuthService.clearManualLogOut()
        // this.getFormData()
      }
    }
  },
}
</script>
