<template>
  <div class="ripa-home-container">
    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>
    <template v-if="isEditingForm">
      <ripa-form-template
        v-model="stop"
        :beats="mappedFormBeats"
        :county-cities="mappedFormCountyCities"
        :display-beat-input="displayBeatInput"
        :form-step-index="formStepIndex"
        :full-stop="fullStop"
        :last-location="lastLocation"
        :loading-gps="loadingGps"
        :loading-pii-step1="loadingPiiStep1"
        :loading-pii-step3="loadingPiiStep3"
        :loading-pii-step4="loadingPiiStep4"
        :non-county-cities="mappedFormNonCountyCities"
        :schools="mappedFormSchools"
        :statutes="mappedFormStatutes"
        :valid-last-location="isLastLocationValid"
        :on-add-person="handleAddPerson"
        :on-cancel="handleCancel"
        :on-delete-person="handleDeletePerson"
        :on-edit-person="handleEditPerson"
        :on-gps-location="handleGpsLocation"
        :on-open-favorites="handleOpenFavorites"
        :on-open-last-location="handleOpenLastLocation"
        :on-open-statute="handleOpenStatute"
        :on-save-favorite="handleSaveFavorite"
        :on-step-index-change="handleStepIndexChange"
        :on-submit="handleSubmit"
        @input="handleInput"
      ></ripa-form-template>
    </template>

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
  </div>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaHomeContainerMixin from '@/components/mixins/RipaHomeContainerMixin'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-home-container',

  mixins: [RipaHomeContainerMixin, RipaApiStopJobMixin],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaIntroTemplate,
    RipaStatuteDialog,
  },

  data() {
    return {
      formStepIndex: 1,
      fullStop: {},
      isEditingForm: false,
      loadingGps: false,
      loadingPiiStep1: false,
      loadingPiiStep3: false,
      loadingPiiStep4: false,
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
      'displayBeatInput',
    ]),
  },

  methods: {
    ...mapActions(['checkTextForPii', 'checkGpsLocation']),

    handleStepIndexChange(index) {
      this.formStepIndex = index
      localStorage.setItem('ripa_form_step_index', index.toString())
    },

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    async handleGpsLocation() {
      this.loadingGps = true
      await this.checkGpsLocation()
      this.loadingGps = false
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
    const localFormCurrentUser = localStorage.getItem('ripa_form_current_user')
    const localFormEditing = localStorage.getItem('ripa_form_editing')
    const localStop = localStorage.getItem('ripa_form_stop')
    const localFullStop = localStorage.getItem('ripa_form_full_stop')
    const stepIndex = localStorage.getItem('ripa_form_step_index') || 1

    if (localFormEditing) {
      const isEditing = localFormEditing === '1'
      const parsedStop = JSON.parse(localStop)
      const parsedFullStop = JSON.parse(localFullStop)
      const [filteredPerson] = parsedFullStop.people.filter(
        item => item.id === Number(localFormCurrentUser),
      )
      this.stop = parsedStop
      this.fullStop = {
        ...parsedFullStop,
        person: filteredPerson,
      }
      if (Object.keys(this.fullStop).length > 0) {
        this.isEditingForm = isEditing
        this.formStepIndex = Number(stepIndex)
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
        localStorage.setItem(
          'ripa_form_current_user',
          this.stop.person.id.toString(),
        )
        localStorage.setItem('ripa_form_stop', JSON.stringify(this.stop))
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
