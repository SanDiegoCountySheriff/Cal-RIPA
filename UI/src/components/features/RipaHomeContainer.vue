<template>
  <div class="ripa-home-container">
    <template v-if="!isEditingForm">
      <ripa-intro-template
        v-if="getAuthAndLocalStorageCheck"
        :on-template="handleTemplate"
      ></ripa-intro-template>
    </template>
    <template v-if="isEditingForm">
      <ripa-form-template
        v-model="stop"
        :beats="mappedFormBeats"
        :county-cities="mappedFormCountyCities"
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
        :on-open-favorites="handleOpenFavorites"
        :on-open-last-location="handleOpenLastLocation"
        :on-save-favorite="handleSaveFavorite"
        :on-gps-location="handleGpsLocation"
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
  </div>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaHomeContainerMixin from '@/components/mixins/RipaHomeContainerMixin'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-home-container',

  mixins: [RipaHomeContainerMixin, RipaApiStopJobMixin],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaIntroTemplate,
  },

  data() {
    return {
      fullStop: {},
      isEditingForm: false,
      loadingGps: false,
      loadingPiiStep1: false,
      loadingPiiStep3: false,
      loadingPiiStep4: false,
      stop: {},
    }
  },

  computed: {
    ...mapGetters([
      'isOnlineAndAuthenticated',
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
      'officerId',
      'agency',
      'mappedGpsLocationAddress',
      'isAuthenticated',
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
  },

  methods: {
    ...mapActions(['checkTextForPii', 'checkGpsLocation']),

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
      const trimmedTextValue = textValue || ''
      if (this.isOnlineAndAuthenticated && trimmedTextValue.length > 0) {
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
      if (this.isOnlineAndAuthenticated && textValue && textValue.length > 0) {
        this.loadingPiiStep3 = true
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
        this.loadingPiiStep3 = false
        this.updateFullStop()
      }
    },

    async validateBasisForSearchForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue.length > 0) {
        this.loadingPiiStep4 = true
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.actionsTaken) {
          this.stop.actionsTaken.basisForSearchPiiFound = isFound
        }
        this.loadingPiiStep4 = false
        this.updateFullStop()
      }
    },
  },

  watch: {
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
