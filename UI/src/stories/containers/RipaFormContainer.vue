<template>
  <ripa-page-container :admin="admin">
    <vue-confirm-dialog></vue-confirm-dialog>

    <ripa-form-template
      v-model="stop"
      :admin-editing="isAdminEditing"
      :beats="mappedFormBeats"
      :county-cities="mappedFormCountyCities"
      :display-beat-input="displayBeatInput"
      :display-debugger="displayDebugger"
      :form-step-index="formStepIndex"
      :full-stop="fullStop"
      :is-authenticated="isAuthenticated"
      :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
      :last-location="lastLocation"
      :last-reason="lastReason"
      :last-result="lastResult"
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
      :on-cancel-form="handleCancelForm"
      :on-cancel-action="handleCancelAction"
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
      @input="handleInput"
    ></ripa-form-template>

    <ripa-favorites-dialog
      :show-dialog="showLocationFavoritesDialog"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditLocationFavorite"
      :on-open-favorite="handleOpenLocationFavorite"
      :on-delete-favorite="handleDeleteLocationFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showReasonFavoritesDialog"
      :favorites="favorites"
      :on-close="handleCloseDialog"
      :on-edit-favorite="handleEditReasonFavorite"
      :on-open-favorite="handleOpenReasonFavorite"
      :on-delete-favorite="handleDeleteReasonFavorite"
    ></ripa-favorites-dialog>

    <ripa-favorites-dialog
      :show-dialog="showResultFavoritesDialog"
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
  </ripa-page-container>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaPageContainer from './RipaPageContainer'
import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import RipaFormContainerMixin from '@/components/mixins/RipaFormContainerMixin'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  name: 'ripa-form-container',

  mixins: [RipaFormContainerMixin],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaPageContainer,
    RipaStatuteDialog,
  },

  data() {
    return {
      displayBeatInput: true,
      displayDebugger: true,
      mappedUser: {
        agency: 'Insight',
        startDate: '2010-05-18',
        yearsExperience: 11,
        assignment: 1,
        otherType: null,
        officerId: '2021050812345',
        officerName: 'Steve Pietrek',
      },
      isAuthenticated: false,
      isOnlineAndAuthenticated: false,
      isOnline: true,
      mappedFormBeats: [],
      mappedFormCountyCities: [],
      mappedFormNonCountyCities: [],
      mappedFormSchools: [],
      mappedFormStatutes: [],
    }
  },

  methods: {
    getFormData() {
      this.loading = true
      setTimeout(() => {
        this.mappedFormSchools = formSchools()
        this.mappedFormBeats = formBeats()
        this.mappedFormCountyCities = formCountyCities()
        this.mappedFormNonCountyCities = formNonCountyCities()
        this.mappedFormStatutes = formStatutes()
        this.loading = false
      }, 500)
    },

    handleSubmitStop(apiStop) {
      if (!this.isAdminEditing) {
        this.setLastLocation(this.stop)
      }
      console.log('SUBMIT STOP', apiStop)
    },

    validateLocationForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        const trimmedTextValue = textValue
        this.loadingPiiStep1 = true
        let isFound = false
        isFound = trimmedTextValue.includes('John Doe')
        this.stop = Object.assign({}, this.stop)
        if (this.stop.location) {
          this.stop.location.piiFound = isFound
        }
        this.loadingPiiStep1 = false
        this.updateFullStop()
      }
    },

    validateReasonForStopForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        this.loadingPiiStep3 = true
        let isFound = false
        isFound = textValue.includes('John Doe')
        this.stop = Object.assign({}, this.stop)
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
        this.loadingPiiStep3 = false
        this.updateFullStop()
      }
    },

    validateBasisForSearchForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        this.loadingPiiStep4 = true
        let isFound = false
        isFound = textValue.includes('John Doe')
        this.stop = Object.assign({}, this.stop)
        if (this.stop.actionsTaken) {
          this.stop.actionsTaken.basisForSearchPiiFound = isFound
        }
        this.loadingPiiStep4 = false
        this.updateFullStop()
      }
    },
  },

  created() {
    this.getFormData()
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

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
