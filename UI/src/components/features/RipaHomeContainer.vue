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
        :on-submit="handleSubmit"
        @input="handleInput"
      ></ripa-form-template>
    </template>

    <ripa-favorites-dialog
      :show-dialog="showFavoritesDialog"
      :favorites="favorites"
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
      'isOnline',
      'isAuthenticated',
      'mappedFormBeats',
      'mappedFormCountyCities',
      'mappedFormNonCountyCities',
      'mappedFormSchools',
      'mappedFormStatutes',
      'officerId',
      'agency',
    ]),
  },

  methods: {
    ...mapActions(['checkTextForPii']),

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    async validateReasonForStopForPii(textValue) {
      if (
        this.isOnline &&
        this.isAuthenticated &&
        textValue &&
        textValue.length > 0
      ) {
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
      if (
        this.isOnline &&
        this.isAuthenticated &&
        textValue &&
        textValue.length > 0
      ) {
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
