<template>
  <div class="ripa-form-container">
    <ripa-form-template
      v-model="stop"
      :last-result="lastResult"
      :loading="loading"
      :loading-gps="loadingGps"
      :loading-pii-step1="loadingPiiStep1"
      :loading-pii-step3="loadingPiiStep3"
      :loading-pii-step4="loadingPiiStep4"
      :non-county-cities="mappedFormNonCountyCities"
      :schools="mappedFormSchools"
      :statutes="mappedFormStatutes"
      :user="mappedUser"
      :valid-last-location="isLastLocationValid"
      :stopTemplates="stopTemplates"
      :on-add-person="handleAddPerson"
      :on-cancel-form="handleCancelForm"
      :on-cancel-action="handleCancelAction"
      :on-copy-person="handleCopyPerson"
      :on-delete-person="handleDeletePerson"
      :on-edit-agency-questions="handleEditAgencyQuestions"
      :on-edit-person="handleEditPerson"
      :on-edit-stop="handleEditStop"
      :on-gps-location="handleGpsLocation"
      :on-open-location-favorites="handleOpenLocationFavorites"
      :on-open-reason-favorites="handleOpenReasonFavorites"
      :on-open-result-favorites="handleOpenResultFavorites"
      :on-save-location-favorite="handleSaveLocationFavorite"
      :on-save-reason-favorite="handleSaveReasonFavorite"
      :on-save-result-favorite="handleSaveResultFavorite"
      :on-open-last-location="handleOpenLastLocation"
      :on-open-statute="handleOpenStatute"
      :on-open-template="handleOpenTemplate"
      :on-step-index-change="handleStepIndexChange"
      :on-submit-stop="handleSubmitStop"
      :on-update-user="handleUpdateUser"
      @handle-done="handleDone"
      @input="handleInput"
      @pii-check="handlePiiCheck"
    ></ripa-form-template>

    <ripa-favorites-dialog
      :show-dialog="showLocationFavoritesDialog"
      title="Locations"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditLocationFavorite"
      :on-open-favorite="handleOpenLocationFavorite"
      :on-delete-favorite="handleDeleteLocationFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showReasonFavoritesDialog"
      title="Reasons"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditReasonFavorite"
      :on-open-favorite="handleOpenReasonFavorite"
      :on-delete-favorite="handleDeleteReasonFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showResultFavoritesDialog"
      title="Results"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditResultFavorite"
      :on-open-favorite="handleOpenResultFavorite"
      :on-delete-favorite="handleDeleteResultFavorite"
    ></ripa-favorites-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddLocationFavoriteDialog"
      :on-close="handleCloseDialog"
      :on-add-favorite="handleAddLocationFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddReasonFavoriteDialog"
      :on-close="handleCloseDialog"
      :on-add-favorite="handleAddReasonFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddResultFavoriteDialog"
      :on-close="handleCloseDialog"
      :on-add-favorite="handleAddResultFavorite"
    ></ripa-add-favorite-dialog>

    <ripa-statute-dialog
      :show-dialog="showStatuteDialog"
      :statute="statute"
      :on-close="handleCloseDialog"
    ></ripa-statute-dialog>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :user="getMappedUser"
      :show-dialog="showUserDialog"
      :on-close="handleCloseDialog"
      :on-save="handleSaveUser"
    ></ripa-user-dialog>

    <ripa-snackbar
      text="Stop was stored locally and will be submitted to the server once you are online and authenticated."
      v-model="snackbarNotOnlineVisible"
    >
    </ripa-snackbar>

    <ripa-snackbar
      text="There was an error checking GPS location."
      v-model="snackbarGpsVisible"
    >
    </ripa-snackbar>

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
      :on-view="onViewStopsWithErrors"
    >
    </ripa-snackbar>
  </div>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormContainerMixin from '@/components/mixins/RipaFormContainerMixin'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'ripa-home-container',

  mixins: [RipaFormContainerMixin, RipaApiStopJobMixin],

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
      displayBeatInput: this.displayBeatInput,
      displayDebugger: this.displayDebugger,
      displayReportingEmail: this.displayReportingEmail,
      reportingEmailAddress: this.reportingEmailAddress,
      formStepIndex: computed(() => this.formStepIndex),
      fullStop: computed(() => this.fullStop),
      isOnline: this.isOnline,
      isAuthenticated: this.isAuthenticated,
      isOnlineAndAuthenticated: this.isOnlineAndAuthenticated,
      isApiUnavailable: this.isApiUnavailable,
      lastLocation: computed(() => this.lastLocation),
      lastReason: computed(() => this.lastReason),
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
      'piiServiceAvailable',
      'isApiUnavailable',
      'isAdmin',
      'displayReportingEmail',
      'reportingEmailAddress',
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
      'checkTextForPii',
      'checkGpsLocation',
      'editOfficerUser',
      'editUser',
      'setPiiServiceAvailable',
      'setUserFavoriteLocations',
      'setUserFavoriteReasons',
      'setUserFavoriteResults',
      'setResetPagination',
      'setStopsWithErrors',
    ]),

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
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.location.piiFound =
          response && response.piiEntities && response.piiEntities.length > 0
        this.stop.isPiiFound =
          this.stop.isPiiFound || this.stop.location.piiFound

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
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.stopReason.reasonForStopPiiFound =
          response && response.piiEntities && response.piiEntities.length > 0
        this.stop.isPiiFound =
          this.stop.isPiiFound || this.stop.stopReason.reasonForStopPiiFound

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
        const response = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        this.stop.actionsTaken.basisForSearchPiiFound =
          response && response.piiEntities && response.piiEntities.length > 0
        this.stop.isPiiFound =
          this.stop.isPiiFound || this.stop.actionsTaken.basisForSearchPiiFound

        if (
          !this.stop.actionsTaken.basisForSearchPiiFound &&
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
