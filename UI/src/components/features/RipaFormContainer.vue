<template>
  <div class="ripa-form-container">
    <ripa-form-template
      v-model="stop"
      @on-add-person="handleAddPerson"
      @on-cancel-form="handleCancelForm"
      @on-cancel-action="handleCancelAction"
      @on-copy-person="handleCopyPerson"
      @on-delete-person="handleDeletePerson"
      @on-edit-agency-questions="handleEditAgencyQuestions"
      @on-edit-person="handleEditPerson"
      @on-edit-stop="handleEditStop"
      @on-gps-location="handleGpsLocation"
      @on-open-location-favorites="handleOpenLocationFavorites"
      @on-open-reason-favorites="handleOpenReasonFavorites"
      @on-open-result-favorites="handleOpenResultFavorites"
      @on-save-location-favorite="handleSaveLocationFavorite"
      @on-save-reason-favorite="handleSaveReasonFavorite"
      @on-save-result-favorite="handleSaveResultFavorite"
      @on-open-last-location="handleOpenLastLocation"
      @on-open-statute="handleOpenStatute"
      @on-open-template="handleOpenTemplate"
      @on-step-index-change="handleStepIndexChange"
      @on-submit-stop="handleSubmitStop"
      @on-update-user="handleUpdateUser"
      @on-set-person-search-automatically-selected="
        handleSetPersonSearchAutomaticallySelected
      "
      @on-set-property-search-automatically-selected="
        handleSetPropertySearchAutomaticallySelected
      "
      @handle-done="handleDone"
      @pii-check="handlePiiCheck"
      @on-open-favorite-location="handleOpenLocationFavorite"
      @on-open-favorite-reason="handleOpenReasonFavorite"
      @on-open-favorite-result="handleOpenResultFavorite"
    ></ripa-form-template>

    <ripa-favorites-dialog
      :show-dialog="showLocationFavoritesDialog"
      :favorites="favorites"
      title="Locations"
      @on-close="handleCloseDialog"
      @on-edit-favorite="handleEditLocationFavorite"
      @on-open-favorite="handleOpenLocationFavorite"
      @on-delete-favorite="handleDeleteLocationFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showReasonFavoritesDialog"
      :favorites="favorites"
      title="Reasons"
      @on-close="handleCloseDialog"
      @on-edit-favorite="handleEditReasonFavorite"
      @on-open-favorite="handleOpenReasonFavorite"
      @on-delete-favorite="handleDeleteReasonFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showResultFavoritesDialog"
      :favorites="favorites"
      title="Results"
      @on-close="handleCloseDialog"
      @on-edit-favorite="handleEditResultFavorite"
      @on-open-favorite="handleOpenResultFavorite"
      @on-delete-favorite="handleDeleteResultFavorite"
    ></ripa-favorites-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddLocationFavoriteDialog"
      @on-close="handleCloseDialog"
      @on-add-favorite="handleAddLocationFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddReasonFavoriteDialog"
      @on-close="handleCloseDialog"
      @on-add-favorite="handleAddReasonFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddResultFavoriteDialog"
      @on-close="handleCloseDialog"
      @on-add-favorite="handleAddResultFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-statute-dialog
      :show-dialog="showStatuteDialog"
      :statute="statute"
      @on-close="handleCloseDialog"
    ></ripa-statute-dialog>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :show-dialog="showUserDialog"
      @on-close="handleCloseDialog"
      @on-save="handleSaveUser"
    ></ripa-user-dialog>

    <ripa-snackbar
      v-model="snackbarNotOnlineVisible"
      text="Stop was stored locally and will be submitted to the server once you are online and authenticated."
    >
    </ripa-snackbar>

    <ripa-snackbar
      v-model="snackbarGpsVisible"
      text="There was an error checking GPS location."
    >
    </ripa-snackbar>

    <ripa-snackbar
      v-model="snackbarNoErrorsVisible"
      :text="snackbarText"
      multi-line
    >
    </ripa-snackbar>

    <ripa-snackbar
      v-model="snackbarErrorsVisible"
      :text="snackbarText"
      :auto-close="false"
      @on-view="onViewStopsWithErrors"
      multi-line
      view-button-visible
    >
    </ripa-snackbar>
  </div>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions } from 'vuex'
import { computed } from 'vue'
import {
  defaultLocation,
  defaultStop,
  fullStopToApiStop,
  fullStopToApiStopV2,
  stopReasonGivenTemplate,
  stopResultGivenTemplate,
} from '@/utilities/stop'
import { format } from 'date-fns'
import { getStatuteContent } from '@/utilities/statutes'

export default {
  name: 'ripa-form-container',

  mixins: [RipaApiStopJobMixin],
  inject: ['version'],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaSnackbar,
    RipaStatuteDialog,
    RipaUserDialog,
  },

  data() {
    return {
      apiStop: null,
      fullStop: {},
      stop: {},
      favorites: [],
      formStepIndex: 0,
      lastLocation: null,
      lastReason: null,
      lastResult: null,
      loadingGps: false,
      loadingPiiStep1: false,
      loadingPiiStep3: false,
      loadingPiiStep4: false,
      savedLocation: null,
      savedLocationVersion: null,
      savedReason: null,
      savedReasonVersion: null,
      savedResult: null,
      savedResultVersion: null,
      showAddLocationFavoriteDialog: false,
      showAddReasonFavoriteDialog: false,
      showAddResultFavoriteDialog: false,
      showLocationFavoritesDialog: false,
      showReasonFavoritesDialog: false,
      showResultFavoritesDialog: false,
      showStatuteDialog: false,
      showUserDialog: false,
      statute: null,
      snackbarNotOnlineVisible: false,
      snackbarGpsVisible: false,
      loading: false,
    }
  },

  provide() {
    return {
      isAdminEditing: this.isAdminEditing,
      isAdminViewing: this.isAdminViewing,
      isAdmin: this.isAdmin,
      beats: this.mappedFormBeats,
      countyCities: this.mappedFormCountyCities,
      nonCountyCities: this.mappedFormNonCountyCities,
      schools: this.mappedFormSchools,
      statutes: this.filteredStatutes,
      displayBeatInput: this.displayBeatInput,
      displayDebugger: this.displayDebugger,
      ab2234Enabled: computed(() => this.ab2234Enabled),
      displayReportingEmail: this.displayReportingEmail,
      reportingEmailAddress: this.reportingEmailAddress,
      formStepIndex: computed(() => this.formStepIndex),
      fullStop: computed(() => this.fullStop),
      isOnline: this.isOnline,
      online: computed(() => this.isOnline),
      isAuthenticated: computed(() => this.isAuthenticated),
      isOnlineAndAuthenticated: computed(() => this.isOnlineAndAuthenticated),
      isApiUnavailable: this.isApiUnavailable,
      lastLocation: computed(() => this.lastLocation ?? null),
      lastReason: computed(() => this.lastReason ?? null),
      lastResult: computed(() => this.lastResult ?? null),
      loading: computed(() => this.loading),
      loadingGps: computed(() => this.loadingGps),
      loadingPiiStep1: computed(() => this.loadingPiiStep1),
      loadingPiiStep3: computed(() => this.loadingPiiStep3),
      loadingPiiStep4: computed(() => this.loadingPiiStep4),
      user: computed(() => this.mappedUser),
      validLastLocation: this.isLastLocationValid,
      stopTemplates: this.stopTemplates,
      personSearchAutomaticallySelected: computed(
        () => this.personSearchAutomaticallySelected,
      ),
      propertySearchAutomaticallySelected: computed(
        () => this.propertySearchAutomaticallySelected,
      ),
      version: computed(() => this.mappedVersion),
      stopVersion: computed(() => this.stop.stopVersion),
      favoriteLocations: computed(() => this.getFavoriteLocations),
      favoriteReasons: computed(() => this.getFavoriteReasons),
      favoriteResults: computed(() => this.getFavoriteResults),
    }
  },

  computed: {
    ...mapGetters([
      'invalidUser',
      'isOnline',
      'isAuthenticated',
      'isOnlineAndAuthenticated',
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
      'mappedGpsLocationAddress',
      'mappedUser',
      'displayBeatInput',
      'displayDebugger',
      'stopTemplates',
      'isApiUnavailable',
      'isAdmin',
      'displayReportingEmail',
      'reportingEmailAddress',
      'personSearchAutomaticallySelected',
      'propertySearchAutomaticallySelected',
      'mappedVersion',
      'favoriteLocations',
      'favoriteReasons',
      'favoriteResults',
      'piiServiceAvailable',
    ]),

    ab2234Enabled() {
      return this.$store.getters?.ab2234Enabled || false
    },

    filteredStatutes() {
      if (this.isAdminEditing) {
        return this.mappedFormStatutes
      } else {
        return this.mappedFormStatutes.filter(item => !item.repealed)
      }
    },

    getMappedUser() {
      return {
        agency: this.mappedUser.agency,
        assignment: this.mappedUser.assignment,
        otherType: this.mappedUser.otherType,
        startDate: this.mappedUser.startDate,
        yearsExperience: this.mappedUser.yearsExperience,
        officerRace: this.mappedUser.officerRace || [],
        officerGender: this.mappedUser.officerGender,
      }
    },

    isAdminEditing() {
      const value = localStorage.getItem('ripa_form_admin_editing')
      return value ? value === '1' : false
    },

    isAdminViewing() {
      const value = localStorage.getItem('ripa_form_admin_viewing')
      return value ? value === '1' : false
    },

    isLastLocationValid() {
      const lastLocation = this.getLastLocation()
      return lastLocation !== null
    },

    getFavoriteLocations() {
      return this.favoriteLocations
        ? JSON.parse(this.favoriteLocations)
            .filter(location => {
              if (!location.version) {
                location.version = 1
              }

              if (!location.location.outOfCounty) {
                const cityNotExpired = this.mappedFormCountyCities.some(
                  city => {
                    return city.fullName === location.location.city
                  },
                )

                if (!cityNotExpired) {
                  location.location.city = ''
                  location.favoritesCityExpired = true
                }
              } else if (location.location.outOfCounty) {
                const cityNotExpired = this.mappedFormNonCountyCities.some(
                  city => {
                    return city.fullName === location.location.city
                  },
                )

                if (!cityNotExpired) {
                  location.location.city = ''
                  location.favoritesCityExpired = true
                }
              }

              if (location.location.isSchool) {
                const schoolNotExpired = this.mappedFormSchools.some(school => {
                  return school.cdsCode === location.location.school
                })

                if (!schoolNotExpired) {
                  location.location.school = ''
                  location.favoritesSchoolExpired = true
                }
              }

              return location
            })
            .sort((a, b) => {
              if (!a.count) {
                a.count = 1
              }

              if (!b.count) {
                b.count = 1
              }

              if (a.count > b.count) {
                return -1
              } else if (a.count < b.count) {
                return 1
              }

              return 0
            })
        : []
    },

    getFavoriteReasons() {
      return this.favoriteReasons
        ? JSON.parse(this.favoriteReasons)
            .filter(reason => {
              if (!reason.version) {
                reason.version = 1
              }

              const codes = [
                reason.reason.reasonableSuspicionCode,
                reason.reason.educationViolationCode,
                reason.reason.trafficViolationCode,
              ]

              const codeNotExpired = codes.some(code => {
                return this.mappedFormStatutes.some(statute => {
                  return statute.code === code
                })
              })

              if (!codeNotExpired) {
                reason.reason.reasonableSuspicionCode = null
                reason.reason.educationViolationCode = null
                reason.reason.trafficViolationCode = null
                reason.favoritesCodeExpired = true
              }
              return reason
            })
            .sort((a, b) => {
              if (a.count > b.count) {
                return -1
              } else if (a.count < b.count) {
                return 1
              }
              return 0
            })
        : []
    },

    getFavoriteResults() {
      return this.favoriteResults
        ? JSON.parse(this.favoriteResults)
            .filter(result => {
              if (!result.version) {
                result.version = 1
              }

              if (result.result.warningCodes) {
                const updatedWarningCodes = result.result.warningCodes.filter(
                  code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  },
                )

                if (
                  updatedWarningCodes.length !==
                  result.result.warningCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.warningCodes = updatedWarningCodes
              }

              if (result.result.verbalWarningCodes) {
                const updatedVerbalWarningCodes =
                  result.result.verbalWarningCodes.filter(code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  })

                if (
                  updatedVerbalWarningCodes.length !==
                  result.result.verbalWarningCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.verbalWarningCodes = updatedVerbalWarningCodes
              }

              if (result.result.writtenWarningCodes) {
                const updatedWrittenWarningCodes =
                  result.result.writtenWarningCodes.filter(code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  })

                if (
                  updatedWrittenWarningCodes.length !==
                  result.result.writtenWarningCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.writtenWarningCodes = updatedWrittenWarningCodes
              }

              if (result.result.citationCodes) {
                const updatedCitationCodes = result.result.citationCodes.filter(
                  code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  },
                )

                if (
                  updatedCitationCodes.length !==
                  result.result.citationCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.citationCodes = updatedCitationCodes
              }

              if (result.result.infieldCodes) {
                const updatedInfieldCodes = result.result.infieldCodes.filter(
                  code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  },
                )

                if (
                  updatedInfieldCodes.length !==
                  result.result.infieldCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.infieldCodes = updatedInfieldCodes
              }

              if (result.result.custodialArrestCodes) {
                const updatedCustodialArrestCodes =
                  result.result.custodialArrestCodes.filter(code => {
                    return this.mappedFormStatutes.some(statute => {
                      return statute.code === code
                    })
                  })

                if (
                  updatedCustodialArrestCodes.length !==
                  result.result.custodialArrestCodes.length
                ) {
                  result.favoritesCodeExpired = true
                }

                result.result.custodialArrestCodes = updatedCustodialArrestCodes
              }

              return result
            })
            .sort((a, b) => {
              if (a.count > b.count) {
                return -1
              } else if (a.count < b.count) {
                return 1
              }
              return 0
            })
        : []
    },
  },

  methods: {
    ...mapActions([
      'checkGpsLocation',
      'editOfficerUser',
      'editUser',
      'setUserFavoriteLocations',
      'setUserFavoriteReasons',
      'setUserFavoriteResults',
      'setResetPagination',
      'setStopsWithErrors',
      'setPersonSearchAutomaticallySelected',
      'setPropertySearchAutomaticallySelected',
    ]),

    handleSetPersonSearchAutomaticallySelected() {
      this.setPersonSearchAutomaticallySelected()
    },

    handleSetPropertySearchAutomaticallySelected() {
      this.setPropertySearchAutomaticallySelected()
    },

    addApiStop(apiStop) {
      this.isLocked = true
      const apiStops = this.getApiStopsFromLocalStorage()
      apiStops.push(apiStop)
      this.setApiStopsToLocalStorage(apiStops)
      this.isLocked = false
    },

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    async submitOfficerStopOnline(apiStop) {
      this.resetStopSubmissionStatus()

      await this.submitOfficerStop(apiStop)

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
    },

    getLastLocation() {
      const lastLocation = localStorage.getItem('ripa_last_location')
      if (lastLocation) {
        return JSON.parse(lastLocation)
      }

      return null
    },

    getCustomTemplates() {
      const templates = localStorage.getItem('ripa_templates')
      if (templates) {
        return JSON.parse(templates)
      }

      return null
    },

    handleAddLocationFavorite(name) {
      const newLocation = {
        id: new Date().getTime(),
        name,
        location: this.savedLocation,
        version: this.savedLocationVersion,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }

      const allLocations = this.getFavoriteLocations

      const index = allLocations.findIndex(l => l.name === newLocation.name)

      if (index === -1) {
        allLocations.push(newLocation)
      } else {
        allLocations[index] = newLocation
      }

      this.setFavoriteLocations(allLocations)
      this.savedLocation = null
    },

    handleAddReasonFavorite(name) {
      const newReason = {
        id: new Date().getTime(),
        name,
        reason: this.savedReason,
        version: this.savedReasonVersion,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }

      const allReasons = this.getFavoriteReasons
      const index = allReasons.findIndex(r => r.name === newReason.name)

      if (index === -1) {
        allReasons.push(newReason)
      } else {
        allReasons[index] = newReason
      }
      this.setFavoriteReasons(allReasons)
      this.savedReason = null
    },

    handleAddResultFavorite(name) {
      const newResult = {
        id: new Date().getTime(),
        name,
        result: this.savedResult,
        version: this.savedResultVersion,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }

      const allResults = this.getFavoriteResults
      const index = allResults.findIndex(r => r.name === newResult.name)

      if (index === -1) {
        allResults.push(newResult)
      } else {
        allResults[index] = newResult
      }

      this.setFavoriteResults(allResults)
      this.savedResult = null
    },

    handleAddPerson() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_person', '1')
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.actionsTaken = {
        anyActionsTaken: true,
        actionsTakenDuringStop: [],
        personSearchConsentGiven: false,
        propertySearchConsentGiven: false,
        basisForSearch: [],
        basisForSearchExplanation: null,
        basisForSearchPiiFound: false,
        propertyWasSeized: false,
        basisForPropertySeizure: [],
        typeOfPropertySeized: [],
        anyContraband: false,
        contrabandOrEvidenceDiscovered: [],
      }
      this.stop.nonForceActionsTaken = {
        anyNonForceActionsTaken: true,
        nonForceActionsTakenDuringStop: [],
        personSearchConsentGiven: false,
        propertySearchConsentGiven: false,
        basisForSearch: [],
        basisForSearchExplanation: null,
        basisForSearchPiiFound: false,
        propertyWasSeized: false,
        basisForPropertySeizure: [],
        typeOfPropertySeized: [],
        anyContraband: false,
        contrabandOrEvidenceDiscovered: [],
      }
      this.stop.forceActionsTaken = {
        anyForceActionsTaken: false,
        forceActionsTakenDuringStop: [],
      }
      this.stop.person = {
        id: new Date().getTime(),
        index: this.fullStop.people.length + 1,
        isStudent: false,
        anyDisabilities: false,
        perceivedAge: null,
        perceivedGender: null,
        genderNonconforming: false,
        perceivedLimitedEnglish: false,
        perceivedLgbt: false,
        perceivedSexualOrientation: null,
        perceivedOrKnownDisability: [],
        perceivedRace: [],
        perceivedUnhoused: false,
      }
      this.stop.stopReason = stopReasonGivenTemplate(this.stop.template)
      this.stop.stopResult = stopResultGivenTemplate(this.stop.template)
      this.updateFullStop()
    },

    handleCloseDialog() {
      this.showAddLocationFavoriteDialog = false
      this.showAddReasonFavoriteDialog = false
      this.showAddResultFavoriteDialog = false
      this.showLocationFavoritesDialog = false
      this.showReasonFavoritesDialog = false
      this.showResultFavoritesDialog = false
      this.showStatuteDialog = false
      this.showUserDialog = false
    },

    handleCopyPerson(index) {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_person', '1')
      const [filteredPerson] = this.fullStop.people.filter(
        item => item.index.toString() === index.toString(),
      )
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.actionsTaken = { ...filteredPerson?.actionsTaken } || {}
      this.stop.nonForceActionsTaken = {
        ...filteredPerson?.nonForceActionsTaken,
      }
      this.stop.forceActionsTaken = { ...filteredPerson?.forceActionsTaken }
      this.stop.person = {
        id: new Date().getTime(),
        index: this.fullStop.people.length + 1,
        isStudent: filteredPerson?.isStudent === true,
        anyDisabilities: false,
        perceivedAge: null,
        perceivedGender: null,
        genderNonconforming: false,
        perceivedLimitedEnglish: false,
        perceivedLgbt: false,
        perceivedSexualOrientation: null,
        perceivedOrKnownDisability: [],
        perceivedRace: [],
        perceivedUnhoused: false,
      }
      this.stop.stopReason = { ...filteredPerson?.stopReason } || {}
      this.stop.stopResult = { ...filteredPerson?.stopResult } || {}
      this.updateFullStop()
    },

    handleDeleteLocationFavorite(id) {
      const locations = this.getFavoriteLocations
      const filteredLocations = locations.filter(item => item.id !== id)
      this.setFavoriteLocations(filteredLocations)
    },

    handleDeleteReasonFavorite(id) {
      const reasons = this.getFavoriteReasons
      const filteredReasons = reasons.filter(item => item.id !== id)
      this.setFavoriteReasons(filteredReasons)
    },

    handleDeleteResultFavorite(id) {
      const results = this.getFavoriteResults
      const filteredResults = results.filter(item => item.id !== id)
      this.setFavoriteResults(filteredResults)
    },

    handleDeletePerson(index) {
      const filteredPeople = this.fullStop.people.filter(
        item => item.index.toString() !== index.toString(),
      )
      const updatedFullStop = {
        ...this.fullStop,
        people: filteredPeople.map((person, index) => {
          return {
            ...person,
            index: index + 1,
          }
        }),
      }
      this.fullStop = Object.assign({}, updatedFullStop)
      const filteredPerson = this.fullStop.people[0]

      if (filteredPerson) {
        this.stop = {
          ...this.stop,
          person: filteredPerson,
        }
      }
    },

    handleEditLocationFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const locations = this.getFavoriteLocations
      const filteredLocations = locations.filter(
        item => item.id !== updatedFav.id,
      )
      filteredLocations.push(updatedFav)
      this.setFavoriteLocations(filteredLocations)
    },

    handleEditReasonFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const reasons = this.getFavoriteReasons
      const filteredReasons = reasons.filter(item => item.id !== updatedFav.id)
      filteredReasons.push(updatedFav)
      this.setFavoriteReasons(filteredReasons)
    },

    handleEditResultFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const results = this.getFavoriteResults
      const filteredResults = results.filter(item => item.id !== updatedFav.id)
      filteredResults.push(updatedFav)
      this.setFavoriteResults(filteredResults)
    },

    handleEditAgencyQuestions() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_agency_questions', '1')
    },

    handleEditPerson(index) {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_person', '1')
      const [filteredPerson] = this.fullStop.people.filter(
        item => item.index.toString() === index.toString(),
      )
      this.stop = {
        ...this.stop,
        actionsTaken: filteredPerson?.actionsTaken || {},
        nonForceActionsTaken: filteredPerson?.nonForceActionsTaken,
        forceActionsTaken: filteredPerson?.forceActionsTaken,
        person: {
          anyDisabilities: filteredPerson?.anyDisabilities || false,
          genderNonconforming: filteredPerson?.genderNonconforming || false,
          id: filteredPerson?.id,
          index: filteredPerson?.index,
          isStudent: filteredPerson?.isStudent || false,
          perceivedAge: filteredPerson?.perceivedAge || null,
          perceivedGender: filteredPerson?.perceivedGender || null,
          perceivedLgbt: filteredPerson?.perceivedLgbt || false,
          perceivedSexualOrientation:
            filteredPerson?.perceivedSexualOrientation || null,
          perceivedUnhoused: filteredPerson?.perceivedUnhoused,
          perceivedLimitedEnglish:
            filteredPerson?.perceivedLimitedEnglish || false,
          perceivedOrKnownDisability:
            filteredPerson?.perceivedOrKnownDisability || [],
          perceivedRace: filteredPerson?.perceivedRace || [],
          nonBinaryPerson: filteredPerson?.nonBinaryPerson,
        },
        stopReason: filteredPerson?.stopReason || {},
        stopResult: filteredPerson?.stopResult || {},
      }
    },

    handleEditStop() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_stop', '1')
    },

    async handleGpsLocation() {
      this.loadingGps = true
      const result = await this.checkGpsLocation()
      if (result === null) {
        this.snackbarGpsVisible = true
      }
      this.loadingGps = false
    },

    handleOpenLocationFavorite(id) {
      this.showLocationFavoritesDialog = false
      const favorites = this.getFavoriteLocations
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.stop.location.isSchool = false
        this.stop.location.school = null
        this.stop.favoriteLocationName = favorite.name
        this.updateFullStop()
        this.lastLocation = {
          newLocation: favorite.location,
          persistSchool: false,
        }
      }
    },

    handleOpenReasonFavorite(id) {
      this.lastReason = null
      this.showReasonFavoritesDialog = false
      const favorites = this.getFavoriteReasons
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.stop.favoriteReasonName = favorite.name
        this.lastReason = favorite.reason
      }
    },

    handleOpenResultFavorite(id) {
      this.lastResult = null
      this.showResultFavoritesDialog = false
      const favorites = this.getFavoriteResults
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.stop.favoriteResultName = favorite.name
        this.lastResult = favorite.result
      }
    },

    handleOpenLocationFavorites(stopVersion) {
      this.favorites = this.getFavoriteLocations.filter(
        item => item.version === stopVersion,
      )
      this.showLocationFavoritesDialog = true
    },

    handleOpenReasonFavorites(stopVersion) {
      this.favorites = this.getFavoriteReasons.filter(
        item => item.version === stopVersion,
      )
      this.showReasonFavoritesDialog = true
    },

    handleOpenResultFavorites(stopVersion) {
      this.favorites = this.getFavoriteResults.filter(
        item => item.version === stopVersion,
      )
      this.showResultFavoritesDialog = true
    },

    handleOpenLastLocation() {
      const location = this.getLastLocation()
      if (location !== null) {
        this.lastLocation = {
          newLocation: location,
          persistSchool: true,
        }
      }
    },

    handleOpenStatute(statute) {
      this.statute = {
        statute,
        content: getStatuteContent(statute, this.stop.stopVersion),
      }
      this.showStatuteDialog = true
    },

    handleSaveLocationFavorite(location, version) {
      this.savedLocation = location
      this.savedLocationVersion = version
      this.showAddLocationFavoriteDialog = true
    },

    handleSaveReasonFavorite(reason, version) {
      this.savedReason = reason
      this.savedReasonVersion = version
      this.showAddReasonFavoriteDialog = true
    },

    handleSaveResultFavorite(result, version) {
      this.savedResult = result
      this.savedResultVersion = version
      this.showAddResultFavoriteDialog = true
    },

    handleStepIndexChange(index) {
      this.formStepIndex = index
      if (index > 0) {
        localStorage.setItem('ripa_form_step_index', index.toString())
      } else {
        localStorage.removeItem('ripa_form_step_index')
      }

      if (this.stop?.stopVersion === 1 && index === 7) {
        localStorage.removeItem('ripa_form_edit_agency_questions')
        localStorage.removeItem('ripa_form_edit_person')
        localStorage.removeItem('ripa_form_edit_stop')
      } else if (this.stop?.stopVersion === 2 && index === 8) {
        localStorage.removeItem('ripa_form_edit_agency_questions')
        localStorage.removeItem('ripa_form_edit_person')
        localStorage.removeItem('ripa_form_edit_stop')
      }
    },

    handleOpenTemplate(value) {
      this.handleStepIndexChange(1)
      localStorage.setItem('ripa_form_editing', '1')
      this.setPiiServiceAvailable(true)
      const templates = this.getCustomTemplates()
      let template

      if (templates) {
        template = templates.find(tplt => {
          return tplt.displayName === value
        })
      }

      // assign defaultStop to this.stop
      this.stop = {
        ...defaultStop(),
      }

      // reassign this.stop with defaultStop plus template details
      if (template) {
        this.stop = {
          ...defaultStop(),
          ...template.options,
          template: template.displayName,
        }

        if (template.loadLastLocation) {
          this.stop.location = defaultLocation()
        }
      }

      this.updateFullStop()
    },

    setFavoriteLocations(locations) {
      if (this.isOnlineAndAuthenticated) {
        const strLocations = JSON.stringify(locations)
        this.setUserFavoriteLocations(strLocations)
        this.editUser(this.mappedUser)
      }
    },

    setFavoriteReasons(reasons) {
      if (this.isOnlineAndAuthenticated) {
        const strReasons = JSON.stringify(reasons)
        this.setUserFavoriteReasons(strReasons)
        this.editUser(this.mappedUser)
      }
    },

    setFavoriteResults(results) {
      if (this.isOnlineAndAuthenticated) {
        const strResults = JSON.stringify(results)
        this.setUserFavoriteResults(strResults)
        this.editUser(this.mappedUser)
      }
    },

    setLastLocation(stop) {
      localStorage.setItem('ripa_last_location', JSON.stringify(stop.location))
    },

    updateFullStop() {
      if (this.stop.person) {
        const updatedPerson = {
          ...this.stop.person,
          id: this.stop?.person.id,
          index: this.stop?.person.index,
          actionsTaken: this.stop?.actionsTaken || null,
          nonForceActionsTaken: this.stop?.nonForceActionsTaken || null,
          forceActionsTaken: this.stop?.forceActionsTaken || null,
          stopReason: this.stop?.stopReason || null,
          stopResult: this.stop?.stopResult || null,
        }
        let updatedFullStop = Object.assign({}, this.fullStop)
        updatedFullStop.stopType = this.getStopType(this.stop)
        updatedFullStop.favoriteLocationName =
          this.stop.favoriteLocationName || ''
        updatedFullStop.favoriteReasonName = this.stop.favoriteReasonName || ''
        updatedFullStop.favoriteResultName = this.stop.favoriteResultName || ''
        updatedFullStop.agencyQuestions = this.stop.agencyQuestions || []
        updatedFullStop.id = this.stop.id
        updatedFullStop.nfia = this.stop.nfia
        updatedFullStop.internalId = this.stop.internalId
        updatedFullStop.template = this.stop.template
        updatedFullStop.stepTrace = this.stop.stepTrace
        updatedFullStop.location = this.stop.location
        updatedFullStop.stopDate = this.stop.stopDate
        updatedFullStop.lateSubmissionExplanation =
          this.stop.lateSubmissionExplanation || null
        updatedFullStop.isLateSubmission = this.stop.isLateSubmission || false
        updatedFullStop.piiEntities = this.stop.piiEntities
        updatedFullStop.isPiiFound = this.stop.isPiiFound
        updatedFullStop.officerWorksWithNonReportingAgency =
          this.stop.officerWorksWithNonReportingAgency || false
        updatedFullStop.stopMadeDuringWelfareCheck =
          this.stop.stopMadeDuringWelfareCheck
        updatedFullStop.editStopExplanation =
          this.stop.editStopExplanation || null
        updatedFullStop.overridePii = this.stop.overridePii || false
        updatedFullStop.stopVersion = this.stop.stopVersion || 1
        const personId = this.stop.person.id
        const people = updatedFullStop.people || []
        updatedFullStop.people = people.filter(item => item.id !== personId)
        updatedFullStop.people.push(updatedPerson)
        updatedFullStop = {
          ...updatedFullStop,
          people: updatedFullStop.people
            .sort((a, b) => a.id - b.id)
            .map((person, index) => {
              return {
                ...person,
                index: index + 1,
              }
            }),
        }
        this.fullStop = Object.assign({}, updatedFullStop)

        this.apiStop =
          this.fullStop.stopVersion === 1
            ? fullStopToApiStop(
                this.isOnlineAndAuthenticated,
                this.fullStop,
                this.mappedFormBeats,
                this.mappedFormCountyCities,
                this.mappedFormNonCountyCities,
                this.mappedFormSchools,
                this.mappedFormStatutes,
              )
            : fullStopToApiStopV2(
                this.isOnlineAndAuthenticated,
                this.fullStop,
                this.mappedFormBeats,
                this.mappedFormCountyCities,
                this.mappedFormNonCountyCities,
                this.mappedFormSchools,
                this.mappedFormStatutes,
              )
      }
    },

    getStopType(stop) {
      if (stop.stopVersion === 2) {
        return stop.stopType
      }
      return null
    },

    clearLocalStorage() {
      localStorage.removeItem('ripa_errored_stop_internal_id')
      localStorage.removeItem('ripa_form_admin_editing')
      localStorage.removeItem('ripa_form_admin_viewing')
      localStorage.removeItem('ripa_form_api_stop')
      localStorage.removeItem('ripa_form_cached')
      localStorage.removeItem('ripa_form_edit_agency_questions')
      localStorage.removeItem('ripa_form_edit_person')
      localStorage.removeItem('ripa_form_edit_route')
      localStorage.removeItem('ripa_form_edit_stop')
      localStorage.removeItem('ripa_form_editing')
      localStorage.removeItem('ripa_form_editing_stop_with_error')
      localStorage.removeItem('ripa_form_full_stop')
      localStorage.removeItem('ripa_form_saved_stop')
      localStorage.removeItem('ripa_form_saved_full_stop')
      localStorage.removeItem('ripa_form_step_index')
      localStorage.removeItem('ripa_form_stop')
      localStorage.removeItem('ripa_form_submitted_api_stop')
      localStorage.removeItem('ripa_form_submitted_submissions')
    },

    handleCancelForm() {
      const route = localStorage.getItem('ripa_form_edit_route')
      this.clearLocalStorage()
      this.stop = null
      this.fullStop = null
      if (route) {
        if (route === '/admin' || route === '/admin/stops') {
          this.setResetPagination(false)
        }
        this.$router.push(route)
      }
    },

    handleCancelAction() {
      localStorage.removeItem('ripa_form_edit_agency_questions')
      localStorage.removeItem('ripa_form_edit_person')
      localStorage.removeItem('ripa_form_edit_stop')

      const parsedStop = JSON.parse(
        localStorage.getItem('ripa_form_saved_stop'),
      )
      const parsedFullStop = JSON.parse(
        localStorage.getItem('ripa_form_saved_full_stop'),
      )

      if (parsedStop && parsedFullStop) {
        localStorage.removeItem('ripa_form_saved_stop')
        localStorage.removeItem('ripa_form_saved_full_stop')
        this.handleStepIndexChange(parsedStop.stopVersion === 2 ? 8 : 7)
        this.stop = parsedStop
        this.fullStop = parsedFullStop
      }
    },

    handleDone() {
      const route = localStorage.getItem('ripa_form_edit_route')
      this.clearLocalStorage()
      this.$router.push(route)
    },

    handleSaveUser(user) {
      this.editOfficerUser(user)
    },

    async handleSubmitStop(apiStop) {
      const internalId = localStorage.getItem('ripa_errored_stop_internal_id')
      if (internalId) {
        this.deleteStopWithError(internalId)
      }

      if (!this.isAdminEditing) {
        this.setLastLocation(this.stop)
      }

      if (this.isOnlineAndAuthenticated) {
        this.loading = true
        await this.submitOfficerStopOnline(apiStop)
        this.loading = false
      } else {
        this.addApiStop(apiStop)
        this.snackbarNotOnlineVisible = true
      }
    },

    handleUpdateUser() {
      this.showUserDialog = true
    },

    async handlePiiCheck({ source, value }) {
      switch (source) {
        case 'location':
          await this.validateLocationForPii(value)
          break
        case 'reason':
          await this.validateReasonForStopForPii(value)
          break
        case 'search':
          await this.validateBasisForSearchForPii(value)
          break
        default:
          console.log('Error handling PII check')
          break
      }
    },

    async validateLocationForPii(textValue) {
      const trimmedTextValue = textValue ? textValue.trim() : ''
      if (
        this.isOnlineAndAuthenticated &&
        !this.invalidUser &&
        trimmedTextValue.length > 0
      ) {
        this.loadingPiiStep1 = true
        await this.setPiiServiceAvailable(true)
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.location.piiFound =
          response && response.piiEntities && response.piiEntities.length > 0
        this.stop.isPiiFound =
          this.stop.stopReason.reasonForStopPiiFound ||
          this.stop.location.piiFound ||
          this.stop.actionsTaken?.basisForSearchPiiFound ||
          this.stop.nonForceActionsTaken?.basisForSearchPiiFound

        if (!this.stop.location.piiFound && this.stop.piiEntities?.length > 0) {
          this.stop.piiEntities = this.stop.piiEntities.filter(
            e => e.source !== this.locationSource,
          )
        }

        if (!response && trimmedTextValue.length > 0) {
          await this.setPiiServiceAvailable(false)
        } else if (response.piiEntities.length > 0) {
          this.stop.piiEntities = this.stop.piiEntities
            ? this.stop.piiEntities.filter(
                e => e.source !== this.locationSource,
              )
            : []
          for (const entity of response.piiEntities) {
            entity.source = this.locationSource
            this.stop.piiEntities.push(entity)
          }
        }

        if (!this.piiServiceAvailable && !this.stop.overridePii) {
          this.stop.isPiiFound = true
          this.stop.piiEntities.push({
            entityText:
              'Text analytics service was unavailable, please review this field for PII',
            source: this.locationSource,
          })
        }

        this.loadingPiiStep1 = false
        this.updateFullStop()
      }
    },

    async validateReasonForStopForPii(textValue) {
      const trimmedTextValue = textValue ? textValue.trim() : ''
      if (
        this.isOnlineAndAuthenticated &&
        !this.invalidUser &&
        trimmedTextValue.length > 0
      ) {
        this.loadingPiiStep3 = true
        await this.setPiiServiceAvailable(true)
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.stopReason.reasonForStopPiiFound =
          response && response.piiEntities && response.piiEntities.length > 0
        this.stop.isPiiFound =
          this.stop.stopReason.reasonForStopPiiFound ||
          this.stop.location.piiFound ||
          this.stop.actionsTaken?.basisForSearchPiiFound ||
          this.stop.nonForceActionsTaken?.basisForSearchPiiFound

        if (
          !this.stop.stopReason.reasonForStopPiiFound &&
          this.stop.piiEntities?.length > 0
        ) {
          this.stop.piiEntities = this.stop.piiEntities.filter(
            e => e.source !== this.stopReasonSource + this.stop.person.index,
          )
        }

        if (!response && trimmedTextValue.length > 0) {
          await this.setPiiServiceAvailable(false)
        } else if (response.piiEntities.length > 0) {
          this.stop.piiEntities = this.stop.piiEntities
            ? this.stop.piiEntities.filter(
                e =>
                  e.source !== this.stopReasonSource + this.stop.person.index,
              )
            : []
          for (const entity of response.piiEntities) {
            entity.source = this.stopReasonSource + this.stop.person.index
            this.stop.piiEntities.push(entity)
          }
        }

        if (!this.piiServiceAvailable && !this.stop.overridePii) {
          this.stop.isPiiFound = true
          this.stop.piiEntities.push({
            entityText:
              'Text analytics service was unavailable, please review this field for PII',
            source: this.stopReasonSource + this.stop.person.index,
          })
        }

        this.loadingPiiStep3 = false
        this.updateFullStop()
      }
    },

    async validateBasisForSearchForPii(textValue) {
      const trimmedTextValue = textValue ? textValue.trim() : ''

      if (
        this.isOnlineAndAuthenticated &&
        !this.invalidUser &&
        trimmedTextValue.length > 0
      ) {
        this.loadingPiiStep4 = true
        await this.setPiiServiceAvailable(true)
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)

        if (this.stop.stopVersion === 1) {
          this.stop.actionsTaken.basisForSearchPiiFound =
            response && response.piiEntities && response.piiEntities.length > 0
          this.stop.isPiiFound =
            this.stop.stopReason.reasonForStopPiiFound ||
            this.stop.location.piiFound ||
            this.stop.actionsTaken?.basisForSearchPiiFound ||
            this.stop.nonForceActionsTaken?.basisForSearchPiiFound

          if (
            !this.stop.actionsTaken?.basisForSearchPiiFound &&
            this.stop.piiEntities?.length > 0
          ) {
            this.stop.piiEntities = this.stop.piiEntities.filter(
              e =>
                e.source !== this.basisForSearchSource + this.stop.person.index,
            )
          }

          if (!response && trimmedTextValue.length > 0) {
            await this.setPiiServiceAvailable(false)
          } else if (response.piiEntities.length > 0) {
            this.stop.piiEntities = this.stop.piiEntities
              ? this.stop.piiEntities.filter(
                  e =>
                    e.source !==
                    this.basisForSearchSource + this.stop.person.index,
                )
              : []
            for (const entity of response.piiEntities) {
              entity.source = this.basisForSearchSource + this.stop.person.index
              this.stop.piiEntities.push(entity)
            }
          }
        } else {
          this.stop.nonForceActionsTaken.basisForSearchPiiFound =
            response && response.piiEntities && response.piiEntities.length > 0
          this.stop.isPiiFound =
            this.stop.stopReason.reasonForStopPiiFound ||
            this.stop.location.piiFound ||
            this.stop.actionsTaken?.basisForSearchPiiFound ||
            this.stop.nonForceActionsTaken?.basisForSearchPiiFound

          if (
            !this.stop.nonForceActionsTaken?.basisForSearchPiiFound &&
            this.stop.piiEntities?.length > 0
          ) {
            this.stop.piiEntities = this.stop.piiEntities.filter(
              e =>
                e.source !== this.basisForSearchSource + this.stop.person.index,
            )
          }

          if (!response && trimmedTextValue.length > 0) {
            await this.setPiiServiceAvailable(false)
          } else if (response.piiEntities.length > 0) {
            this.stop.piiEntities = this.stop.piiEntities
              ? this.stop.piiEntities.filter(
                  e =>
                    e.source !==
                    this.basisForSearchSource + this.stop.person.index,
                )
              : []
            for (const entity of response.piiEntities) {
              entity.source = this.basisForSearchSource + this.stop.person.index
              this.stop.piiEntities.push(entity)
            }
          }
        }

        if (!this.piiServiceAvailable && !this.stop.overridePii) {
          this.stop.isPiiFound = true
          this.stop.piiEntities.push({
            entityText:
              'Text analytics service was unavailable, please review this field for PII',
            source: this.basisForSearchSource,
          })
        }

        this.loadingPiiStep4 = false
        this.updateFullStop()
      }
    },

    onViewStopsWithErrors() {
      this.$emit('on-view-stops-with-errors')
    },
  },

  watch: {
    mappedGpsLocationAddress(newVal) {
      this.lastLocation = {
        newLocation: newVal,
        persistSchool: true,
      }
    },

    stop: {
      handler: function (newVal) {
        if (newVal) {
          this.updateFullStop()
        }
      },
      deep: true,
    },

    fullStop(newVal) {
      this.fullStop = newVal
      if (this.formStepIndex > 0) {
        if (this.stop) {
          localStorage.setItem('ripa_form_stop', JSON.stringify(this.stop))
          localStorage.setItem('ripa_form_full_stop', JSON.stringify(newVal))
          localStorage.setItem(
            'ripa_form_api_stop',
            JSON.stringify(this.apiStop),
          )
        }
      }
    },
  },

  mounted() {
    const localFormEditing = localStorage.getItem('ripa_form_editing')
    const localStop = localStorage.getItem('ripa_form_stop')
    const localFullStop = localStorage.getItem('ripa_form_full_stop')
    const stepIndex = localStorage.getItem('ripa_form_step_index') || 1

    if (localFormEditing) {
      const parsedStop = JSON.parse(localStop)
      const parsedFullStop = JSON.parse(localFullStop)

      this.stop = parsedStop
      this.fullStop = parsedFullStop

      if (Object.keys(this.fullStop).length > 0) {
        this.formStepIndex = Number(stepIndex)
        localStorage.setItem('ripa_form_cached', '1')
      } else {
        this.clearLocalStorage()
      }
    }
  },
}
</script>
