<template v-if="dataReady">
  <ripa-page-wrapper
    :environment-name="environmentName"
    :invalidUser="invalidUser"
    :loading="loading"
    :online="isOnline"
    :is-api-unavailable="isApiUnavailable"
    :on-update-dark="handleUpdateDark"
    :on-update-user="handleUpdateUser"
    :on-view-stops-with-errors="handleViewStopsWithErrors"
    :stops-with-errors="mappedStopsWithErrors"
    :api-stop-job-loading="apiStopJobLoading"
    @handleLogOut="handleLogOut"
    @handleLogIn="handleLogIn"
  >
    <template v-if="!isValidCache">
      <ripa-alert alert-type="error">
        Please log into the application to submit stops.
      </ripa-alert>
    </template>

    <template v-if="isApiUnavailable">
      <ripa-alert alert-type="error">
        RIPA is currently unavailable. Please report to the help desk and try
        again later.
      </ripa-alert>
    </template>

    <template v-if="isValidCache">
      <slot></slot>
    </template>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :loading="loading"
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
      @on-view="handleViewStopsWithErrors"
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
import { mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'
import authentication from '@/authentication'
import { computed } from 'vue'

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
      stopIntervalMsAuth: 5000,
      showInvalidUserDialog: false,
      showStopsWithErrorsDialog: false,
      showUserDialog: false,
      dataReady: false,
      apiStopJobLoading: false,
    }
  },

  provide() {
    return {
      user: computed(() => this.getMappedUser),
      admin: computed(() => this.isAdmin),
      authenticated: computed(() => this.isAuthenticated),
      dark: computed(() => this.isDark),
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
      'isApiUnavailable',
      'piiServiceAvailable',
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
      'editOfficerUser',
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'getFormTemplates',
      'getUser',
      'setConnectionStatus',
      'setStopsWithErrors',
    ]),

    async runApiStopsJob(apiStops) {
      if (this.isOnlineAndAuthenticated) {
        // reset stop submission status in store
        this.resetStopSubmissionStatus()

        // iterate through each apiStop
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          if (apiStop.telemetry.offline && !apiStop.overridePii) {
            for (const person of apiStop.listPersonStopped) {
              // check basisForSearch
              let trimmedTextValue = person.basisForSearchBrief
                ? person.basisForSearchBrief.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                person.basisForSearchPiiFound =
                  response &&
                  response.piiEntities &&
                  response.piiEntities.length > 0
                apiStop.isPiiFound =
                  apiStop.isPiiFound || person.basisForSearchPiiFound
                if (
                  !person.basisForSearchPiiFound &&
                  apiStop.piiEntities?.length > 0
                ) {
                  apiStop.piiEntities = apiStop.piiEntities.filter(
                    e => e.source !== this.basisForSearchSource + person.index,
                  )
                }
                if (!response) {
                  await this.setPiiServiceAvailable(false)
                  person.basisForSearchPiiFound =
                    person.basisForSearchPiiFound || false
                } else if (response.piiEntities.length > 0) {
                  apiStop.piiEntities = apiStop.piiEntities
                    ? apiStop.piiEntities.filter(
                        e =>
                          e.source !== this.basisForSearchSource + person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source = this.basisForSearchSource + person.index
                    apiStop.piiEntities.push(entity)
                  }
                }
              }
              // check reasonForStopExplanation
              trimmedTextValue = person.reasonForStopExplanation
                ? person.reasonForStopExplanation.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                person.reasonForStopPiiFound =
                  response &&
                  response.piiEntities &&
                  response.piiEntities.length > 0
                apiStop.isPiiFound =
                  apiStop.isPiiFound || person.reasonForStopPiiFound
                if (
                  !person.reasonForStopPiiFound &&
                  apiStop.piiEntities?.length > 0
                ) {
                  apiStop.piiEntities = apiStop.piiEntities.filter(
                    e => e.source !== this.stopReasonSource + person.index,
                  )
                }
                if (!response) {
                  await this.setPiiServiceAvailable(false)
                  person.reasonForStopPiiFound =
                    person.reasonForStopPiiFound || false
                } else if (response.piiEntities.length > 0) {
                  apiStop.piiEntities = apiStop.piiEntities
                    ? apiStop.piiEntities.filter(
                        e => e.source !== this.stopReasonSource + person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source = this.stopReasonSource + person.index
                    apiStop.piiEntities.push(entity)
                  }
                }
              }
            }
            // check location
            const trimmedTextValue = apiStop.location.fullAddress
              ? apiStop.location.fullAddress.trim()
              : ''
            if (
              this.isOnlineAndAuthenticated &&
              !this.invalidUser &&
              trimmedTextValue.length > 0
            ) {
              const response = await this.checkTextForPii(trimmedTextValue)
              apiStop.location.piiFound =
                response &&
                response.piiEntities &&
                response.piiEntities.length > 0
              apiStop.isPiiFound =
                apiStop.isPiiFound || apiStop.location.piiFound
              if (
                !apiStop.location.piiFound &&
                apiStop.piiEntities?.length > 0
              ) {
                apiStop.piiEntities = apiStop.piiEntities.filter(
                  e => e.source !== this.locationSource,
                )
              }
              if (!response) {
                await this.setPiiServiceAvailable(false)
                apiStop.location.piiFound = apiStop.location.piiFound || false
              } else if (response.piiEntities.length > 0) {
                apiStop.piiEntities = apiStop.piiEntities
                  ? apiStop.piiEntities.filter(
                      e => e.source !== this.locationSource,
                    )
                  : []
                for (const entity of response.piiEntities) {
                  entity.source = this.locationSource
                  apiStop.piiEntities.push(entity)
                }
              }
            }
          }

          if (!this.piiServiceAvailable && !apiStop.overridePii) {
            apiStop.isPiiFound = true
            apiStop.piiEntities = [
              {
                entityText:
                  'Text analytics service was unavailable, please review the stop for PII',
              },
            ]
          }

          await this.timeout(1500)
          if (!this.isOnlineAndAuthenticated) {
            return
          }
          await this.submitOfficerStop(apiStop)
          this.removeSingleApiStopFromLocalStorage(apiStop)
          await this.timeout(1500)
        }

        this.removeApiStopsFromLocalStorage()

        let stopIdsPassedStr = ''
        if (this.mappedStopSubmissionPassedIds.length > 0) {
          stopIdsPassedStr = `Stop ID(s) submitted successfully: ${this.mappedStopSubmissionPassedIds.join(
            ', ',
          )}.`
        }

        // update snackbarText regardless if errors or not
        this.snackbarText = `${this.mappedStopSubmissionStatus}. ${stopIdsPassedStr}`

        // display no errors snackbar which closes automatically
        if (this.mappedStopSubmissionFailedStops.length === 0) {
          this.snackbarNoErrorsVisible = true
        }

        if (this.mappedStopSubmissionFailedStops.length > 0) {
          // display errors snackbar which remains open
          this.snackbarErrorsVisible = true
          // if there are failed ids, update error stops key
          this.pushFailedStopsToStopsWithErrors(
            this.mappedStopSubmissionFailedStops,
          )
        }
      }
    },

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

    async checkLocalStorage() {
      if (!this.isLocked && this.isOnlineAndAuthenticated) {
        this.isLocked = true
        const apiStops = this.getApiStopsFromLocalStorage()
        if (apiStops.length > 0) {
          this.apiStopJobLoading = true
          await this.runApiStopsJob(apiStops)
          this.apiStopJobLoading = false
        }
        const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
        this.setStopsWithErrors(apiStopsWithErrors)
        this.isLocked = false
      }
    },

    getStopWithErrorGivenInternalId(internalId) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const [filteredApiStopWithStop] = apiStopsWithErrors.filter(
        item => item.internalId === internalId,
      )
      return filteredApiStopWithStop?.apiStop || null
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

    removeApiStopsFromLocalStorage() {
      localStorage.removeItem('ripa_submitted_api_stops')
    },

    removeSingleApiStopFromLocalStorage(apiStop) {
      const apiStops = JSON.parse(
        localStorage.getItem('ripa_submitted_api_stops'),
      )

      const index = apiStops.findIndex(s => s.time === apiStop.time)

      if (index > -1) {
        apiStops.splice(index, 1)
        localStorage.setItem(
          'ripa_submitted_api_stops',
          JSON.stringify(apiStops),
        )
      }
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
      const token = authentication.acquireToken()
      const authenticated = authentication.isAuthenticated()
      if (this.isOnlineAndAuthenticated) {
        if (token === null || !authenticated) {
          this.handleLogIn()
        }
      }
    },

    async updateConnectionStatusInStore() {
      if (navigator.onLine) {
        const online = await this.isWebsiteReachable(this.getServerUrl())
        this.setConnectionStatus(online)
        await this.initPage()
      } else if (!navigator.onLine) {
        this.setConnectionStatus(false)
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
    await this.checkLocalStorage()
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

    viewStopsWithErrors(newVal) {
      if (newVal) {
        this.showStopsWithErrorsDialog = true
      }
    },
  },

  props: {
    viewStopsWithErrors: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
