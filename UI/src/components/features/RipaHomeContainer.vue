<template>
  <div class="ripa-home-container">
    <ripa-form-template
      v-model="stop"
      :beats="mappedFormBeats"
      :county-cities="mappedFormCountyCities"
      :agency-questions="mappedAgencyQuestions"
      :display-beat-input="displayBeatInput"
      :form-step-index="formStepIndex"
      :full-stop="fullStop"
      :is-authenticated="isAuthenticated"
      :last-location="lastLocation"
      :loading-gps="loadingGps"
      :loading-pii-step1="loadingPiiStep1"
      :loading-pii-step3="loadingPiiStep3"
      :loading-pii-step4="loadingPiiStep4"
      :non-county-cities="mappedFormNonCountyCities"
      :schools="mappedFormSchools"
      :statutes="mappedFormStatutes"
      :user="mappedUser"
      :valid-last-location="isLastLocationValid"
      :on-add-person="handleAddPerson"
      :on-cancel="handleCancel"
      :on-delete-person="handleDeletePerson"
      :on-edit-person="handleEditPerson"
      :on-gps-location="handleGpsLocation"
      :on-open-favorites="handleOpenFavorites"
      :on-open-last-location="handleOpenLastLocation"
      :on-open-statute="handleOpenStatute"
      :on-open-template="handleOpenTemplate"
      :on-save-favorite="handleSaveFavorite"
      :on-step-index-change="handleStepIndexChange"
      :on-submit="handleSubmit"
      :on-update-user="handleUpdateUser"
      @input="handleInput"
    ></ripa-form-template>

    <ripa-favorites-dialog
      :show-dialog="showFavoritesDialog"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditFavorite"
      :on-open-favorite="handleOpenFavorite"
      :on-delete-favorite="handleDeleteFavorite"
    ></ripa-favorites-dialog>

    <ripa-add-favorite-dialog
      :show-dialog="showAddFavoriteDialog"
      :on-close="handleCloseDialog"
      :on-add-favorite="handleAddFavorite"
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
      :on-close="handleClose"
      :on-save="handleSaveUser"
    ></ripa-user-dialog>
  </div>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import RipaStopMixin from '@/components/mixins/RipaStopMixin'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-home-container',

  mixins: [RipaStopMixin, RipaApiStopJobMixin],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaStatuteDialog,
    RipaUserDialog,
  },

  data() {
    return {
      formStepIndex: 0,
      fullStop: {},
      loadingGps: false,
      loadingPiiStep1: false,
      loadingPiiStep3: false,
      loadingPiiStep4: false,
      showUserDialog: false,
      statute: null,
      stop: {},
      stopIndex: 1,
    }
  },

  computed: {
    ...mapGetters([
      'invalidUser',
      'isOnlineAndAuthenticated',
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
      'mappedGpsLocationAddress',
      'mappedUser',
      'isAuthenticated',
      'displayBeatInput',
      'mappedAgencyQuestions',
    ]),

    getAuthAndLocalStorageCheck() {
      // if the user is NOT authenticated AND does not have a local storage cache
      // that means they haven't logged in and must reauthenticate
      if (!this.isAuthenticated && !localStorage.getItem('ripa_cache_date')) {
        return false
      } else {
        return true
      }
    },

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
    ...mapActions(['checkTextForPii', 'checkGpsLocation', 'editOfficerUser']),

    handleClose() {
      this.showUserDialog = false
    },

    async handleGpsLocation() {
      this.loadingGps = true
      await this.checkGpsLocation()
      this.loadingGps = false
    },

    handleSaveUser(user) {
      this.editOfficerUser(user)
    },

    handleStepIndexChange(index) {
      this.formStepIndex = index
      localStorage.setItem('ripa_form_step_index', index.toString())
    },

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    handleUpdateUser() {
      this.showUserDialog = true
    },

    async validateLocationForPii(textValue) {
      const trimmedTextValue = textValue ? textValue.trim() : ''
      if (
        this.isOnlineAndAuthenticated &&
        !this.invalidUser &&
        trimmedTextValue.length > 0
      ) {
        this.loadingPiiStep1 = true
        let isFound = false
        isFound = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.location) {
          this.stop.location.piiFound = isFound
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
        let isFound = false
        isFound = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
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
        let isFound = false
        isFound = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.actionsTaken) {
          this.stop.actionsTaken.basisForSearchPiiFound = isFound
        }
        this.loadingPiiStep4 = false
        this.updateFullStop()
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
        localStorage.removeItem('ripa_form_editing')
      }
    }
  },

  watch: {
    stop(newVal) {
      this.stop = newVal
    },

    fullStop(newVal) {
      this.fullStop = newVal
      if (this.isEditingForm) {
        if (this.stop) {
          localStorage.setItem('ripa_form_stop', JSON.stringify(this.stop))
        }
        localStorage.setItem('ripa_form_full_stop', JSON.stringify(newVal))
      }
    },

    'stop.location.fullAddress': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateLocationForPii(newVal)
        }
      },
    },

    'stop.stopReason.reasonForStopExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateReasonForStopForPii(newVal)
        }
      },
    },

    'stop.actionsTaken.basisForSearchExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateBasisForSearchForPii(newVal)
        }
      },
    },

    mappedGpsLocationAddress(newVal) {
      this.lastLocation = newVal
    },
  },
}
</script>
