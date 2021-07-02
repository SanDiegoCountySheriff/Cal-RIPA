<template>
  <ripa-page-wrapper
    :admin="isAdmin"
    :authenticated="isAuthenticated"
    :dark="isDark"
    :display-environment="displayEnvironment"
    :environment-name="environmentName"
    :invalidUser="invalidUser"
    :loading="loading"
    :online="isOnline"
    :on-update-dark="handleUpdateDark"
    :on-update-user="handleUpdateUser"
    @handleLogOut="handleLogOut"
    @handleLogIn="handleLogIn"
  >
    <template v-if="!isValidCacheState">
      <ripa-alert alert-type="error">
        Please log into the application to submit stops.
      </ripa-alert>
    </template>

    <template v-if="isValidCacheState">
      <slot></slot>
    </template>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :loading="loading"
      :user="getMappedUser"
      :show-dialog="showUserDialog"
      :on-close="handleClose"
      :on-save="handleSaveUser"
    ></ripa-user-dialog>

    <ripa-invalid-user-dialog
      :show-dialog="showInvalidUserDialog"
    ></ripa-invalid-user-dialog>

    <ripa-snackbar :text="snackbarText" v-model="snackbarVisible" multi-line>
    </ripa-snackbar>

    <ripa-interval
      :delay="stopInternalMsApi"
      @tick="checkLocalStorage"
    ></ripa-interval>

    <ripa-interval
      :delay="stopInternalMsAuth"
      @tick="checkAuthentication"
    ></ripa-interval>
  </ripa-page-wrapper>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaInterval from '@/components/atoms/RipaInterval'
import RipaInvalidUserDialog from '@/components/molecules/RipaInvalidUserDialog'
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'
import authentication from '@/authentication'

export default {
  name: 'ripa-page-container',

  mixins: [RipaApiStopJobMixin],

  components: {
    RipaAlert,
    RipaInterval,
    RipaInvalidUserDialog,
    RipaPageWrapper,
    RipaSnackbar,
    RipaUserDialog,
  },

  data() {
    return {
      loading: false,
      isDark: this.getDarkFromLocalStorage(),
      stopInternalMsApi: 5000,
      stopInternalMsAuth: 600000,
      showInvalidUserDialog: false,
      showUserDialog: false,
      snackbarText: '',
      snackbarVisible: false,
    }
  },

  computed: {
    ...mapGetters([
      'displayBeatInput',
      'displayEnvironment',
      'environmentName',
      'isAdmin',
      'invalidUser',
      'isAuthenticated',
      'isOnline',
      'isOnlineAndAuthenticated',
      'apiConfig',
      'mappedUser',
      'mappedStopSubmissionStatus',
      'mappedStopSubmissionPassedIds',
      'mappedStopSubmissionFailedIds',
    ]),

    getMappedUser() {
      return {
        agency: this.mappedUser.agency,
        assignment: this.mappedUser.assignment,
        otherType: this.mappedUser.otherType,
        startDate: this.mappedUser.startDate,
        yearsExperience: this.mappedUser.yearsExperience,
      }
    },

    isValidCacheState() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      return cacheDate !== null
    },
  },

  methods: {
    ...mapActions([
      'editOfficerStop',
      'editOfficerUser',
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'getUser',
      'resetStopSubmissionStatus',
    ]),

    async getUserData() {
      await Promise.all([this.getUser()])
    },

    async getFormData() {
      if (this.displayBeatInput) {
        await Promise.all([this.getFormBeats()])
      }
      await Promise.all([
        this.getFormCities(),
        this.getFormSchools(),
        this.getFormStatutes(),
      ])
    },

    getDarkFromLocalStorage() {
      const value = localStorage.getItem('ripa_dark_theme')
      return value === null ? true : value === '1'
    },

    handleClose() {
      this.showUserDialog = false
    },

    handleSaveUser(user) {
      this.editOfficerUser(user)
    },

    handleUpdateDark(value) {
      this.isDark = value
      this.setDarkToLocalStorage()
    },

    handleLogOut() {
      authentication.signOut()
    },

    handleLogIn() {
      authentication.signIn()
    },

    handleUpdateUser() {
      this.showUserDialog = true
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
      localStorage.removeItem('ripa_agency_questions')
      localStorage.setItem('ripa_cache_date', new Date())
    },

    async updateAuthenticatedData() {
      this.loading = true
      this.checkCache()
      await this.getUserData()
      await this.getFormData()
      this.loading = false
    },

    checkAuthentication() {
      if (this.isOnlineAndAuthenticated) {
        authentication.acquireToken().catch(error => {
          console.log(`acquireToken error: ${error}`)
          this.handleLogIn()
        })
      }
    },
  },

  async created() {
    if (this.isOnlineAndAuthenticated) {
      this.updateAuthenticatedData()
    } else {
      if (this.isValidCacheState) {
        this.loading = true
        await this.getFormData()
        this.loading = false
      }
    }
  },

  watch: {
    invalidUser(newVal) {
      if (newVal && this.isOnlineAndAuthenticated) {
        this.showUserDialog = true
      }
    },
  },
}
</script>
