<template v-if="dataReady">
  <ripa-page-wrapper
    :admin="isAdmin"
    :authenticated="isAuthenticated"
    :dark="isDark"
    :environment-name="environmentName"
    :invalidUser="invalidUser"
    :loading="loading"
    :online="isOnline"
    :on-update-dark="handleUpdateDark"
    :on-update-user="handleUpdateUser"
    :on-view-stops-with-errors="handleViewStopsWithErrors"
    :stops-with-errors="mappedStopsWithErrors"
    @handleLogOut="handleLogOut"
    @handleLogIn="handleLogIn"
  >
    <template v-if="!isValidCache">
      <ripa-alert alert-type="error">
        Please log into the application to submit stops.
      </ripa-alert>
    </template>

    <template v-if="isValidCache">
      <slot></slot>
    </template>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :loading="loading"
      :user="getMappedUser"
      :show-dialog="showUserDialog"
      :on-close="handleCloseDialog"
      :on-save="handleSaveUser"
    ></ripa-user-dialog>

    <ripa-invalid-user-dialog
      :show-dialog="showInvalidUserDialog"
    ></ripa-invalid-user-dialog>

    <ripa-snackbar
      :text="snackbarText"
      v-model="snackbarNoErrorsVisible"
      multi-line
    >
    </ripa-snackbar>

    <ripa-snackbar
      :text="snackbarText"
      v-model="snackbarErrorsVisible"
      multi-line
      :auto-close="false"
      view-button-visible
      :on-view="handleViewStopsWithErrors"
    >
    </ripa-snackbar>

    <ripa-interval
      :delay="stopIntervalMsApi"
      @tick="checkLocalStorage"
    ></ripa-interval>

    <ripa-interval
      :delay="stopIntervalMsAuth"
      @tick="checkAuthentication"
    ></ripa-interval>

    <ripa-stops-with-errors-dialog
      :stops-with-errors="mappedStopsWithErrors"
      :show-dialog="showStopsWithErrorsDialog"
      :on-close="handleCloseDialog"
      :on-edit-stop="handleOpenStopWithError"
      :on-delete-stop="handleDeleteStopWithError"
    ></ripa-stops-with-errors-dialog>
  </ripa-page-wrapper>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaEditStopMixin from '@/components/mixins/RipaEditStopMixin'
import RipaInterval from '@/components/atoms/RipaInterval'
import RipaInvalidUserDialog from '@/components/molecules/RipaInvalidUserDialog'
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import RipaStopsWithErrorsDialog from '@/components/molecules/RipaStopsWithErrorsDialog'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'
import authentication from '@/authentication'

export default {
  name: 'ripa-page-container',

  mixins: [RipaApiStopJobMixin, RipaEditStopMixin],

  components: {
    RipaAlert,
    RipaInterval,
    RipaInvalidUserDialog,
    RipaPageWrapper,
    RipaSnackbar,
    RipaStopsWithErrorsDialog,
    RipaUserDialog,
  },

  data() {
    return {
      loading: false,
      isDark: this.getDarkFromLocalStorage(),
      isValidCache: true,
      stopIntervalMsApi: 5000,
      stopIntervalMsAuth: 600000,
      showInvalidUserDialog: false,
      showStopsWithErrorsDialog: false,
      showUserDialog: false,
      snackbarText: '',
      snackbarNoErrorsVisible: false,
      snackbarErrorsVisible: false,
      dataReady: false,
    }
  },

  computed: {
    ...mapGetters([
      'displayBeatInput',
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
      'mappedStopSubmissionFailedStops',
      'mappedStopsWithErrors',
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
  },

  methods: {
    ...mapActions([
      'submitOfficerStop',
      'editOfficerUser',
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'getFormTemplates',
      'getUser',
      'resetStopSubmissionStatus',
    ]),

    ...mapMutations(['updateConnectionStatus', 'updateStopsWithErrors']),

    async getUserData() {
      await Promise.all([this.getUser()])
    },

    async getFormData() {
      if (this.displayBeatInput) {
        await Promise.all([
          this.getFormBeats(),
          this.getFormCities(),
          this.getFormSchools(),
          this.getFormStatutes(),
          this.getFormTemplates(),
        ])
      } else {
        await Promise.all([
          this.getFormCities(),
          this.getFormSchools(),
          this.getFormStatutes(),
          this.getFormTemplates(),
        ])
      }
    },

    getDarkFromLocalStorage() {
      const value = localStorage.getItem('ripa_dark_theme')
      return value === null ? true : value === '1'
    },

    handleCloseDialog() {
      this.showStopsWithErrorsDialog = false
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

    handleViewStopsWithErrors() {
      this.showStopsWithErrorsDialog = true
    },

    handleOpenStopWithError(internalId) {
      this.showStopsWithErrorsDialog = false
      const apiStop = this.getStopWithErrorGivenInternalId(internalId)
      if (apiStop) {
        this.handleEditStopWithError(apiStop, internalId)
      }
    },

    handleDeleteStopWithError(internalId) {
      this.deleteStopWithError(internalId)
    },

    setDarkToLocalStorage() {
      localStorage.setItem('ripa_dark_theme', +this.isDark)
    },

    checkCache() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      if (this.isOnlineAndAuthenticated && cacheDate !== null) {
        const hours = differenceInHours(new Date(), new Date(cacheDate))
        if (hours > 1) {
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
      localStorage.removeItem('ripa_templates')
      localStorage.setItem('ripa_cache_date', new Date())
    },

    async updateAuthenticatedData() {
      this.loading = true
      this.checkCache()
      await this.getUserData()
      await this.getFormData()
      this.isValidCache = true
      this.loading = false
    },

    checkAuthentication() {
      if (this.isOnlineAndAuthenticated) {
        const token = authentication.acquireToken()
        if (token === null) {
          this.handleLogin()
        }
      }
    },

    async updateConnectionStatusInStore() {
      if (navigator.onLine) {
        const online = await this.isWebsiteReachable(this.getServerUrl())
        await this.updateConnectionStatus(online)
        await this.initPage()
      } else if (!navigator.onLine) {
        await this.updateConnectionStatus(false)
      }
    },

    getServerUrl() {
      return window.location.origin
    },

    async isWebsiteReachable(url) {
      try {
        const resp = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
        return resp && (resp.ok || resp.type === 'opaque')
      } catch (err) {
        console.warn('[conn test failure]:', err)
      }
    },

    isValidCacheState() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      const isValid = cacheDate !== null
      this.isValidCache = isValid
      return isValid
    },

    async initPage() {
      if (this.isOnlineAndAuthenticated) {
        await this.updateAuthenticatedData()
      } else {
        if (this.isValidCacheState()) {
          this.loading = true
          await this.getFormData()
          this.loading = false
        }
      }
    },
  },

  async mounted() {
    await this.updateConnectionStatusInStore()
    window.addEventListener('online', this.updateConnectionStatusInStore)
    window.addEventListener('offline', this.updateConnectionStatusInStore)
    this.checkLocalStorage()
    this.dataReady = true
  },

  beforeDestroy() {
    window.removeEventListener('online', this.updateConnectionStatusInStore)
    window.removeEventListener('offline', this.updateConnectionStatusInStore)
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
