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
        :full-stop="fullStop"
        :last-location="lastLocation"
        :loading-pii="loadingPii"
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
      loadingPii: false,
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
      'gpsLocationAddress',
    ]),
  },

  methods: {
    ...mapActions(['checkTextForPii', 'checkGpsLocation']),

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    async handleGpsLocation() {
      this.isGeoLocationLoading = true
      await this.checkGpsLocation()
      this.isGeoLocationLoading = false
    },

    async validateLocationForPii(textValue) {
      const trimmedTextValue = textValue || ''
      if (this.isOnlineAndAuthenticated && trimmedTextValue.length > 0) {
        this.loadingPii = true
        let isFound = false
        isFound = await this.checkTextForPii(trimmedTextValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.location) {
          this.stop.location.piiFound = isFound
        }
        this.loadingPii = false
        this.updateFullStop()
      }
    },

    async validateReasonForStopForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue.length > 0) {
        this.loadingPii = true
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
        this.loadingPii = false
        this.updateFullStop()
      }
    },

    async validateBasisForSearchForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue.length > 0) {
        this.loadingPii = true
        let isFound = false
        isFound = await this.checkTextForPii(textValue)
        this.stop = Object.assign({}, this.stop)
        if (this.stop.actionsTaken) {
          this.stop.actionsTaken.basisForSearchPiiFound = isFound
        }
        this.loadingPii = false
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
  },
}
</script>
