<template>
  <ripa-page-container :admin="admin">
    <vue-confirm-dialog></vue-confirm-dialog>
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
  </ripa-page-container>
</template>

<script>
import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaFavoritesDialog from '@/components/molecules/RipaFavoritesDialog'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaHomeContainerMixin from '@/components/mixins/RipaHomeContainerMixin'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import RipaPageContainer from './RipaPageContainer'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  name: 'ripa-home-container',

  mixins: [RipaHomeContainerMixin, RipaApiStopJobMixin],

  components: {
    RipaAddFavoriteDialog,
    RipaFavoritesDialog,
    RipaFormTemplate,
    RipaIntroTemplate,
    RipaPageContainer,
  },

  data() {
    return {
      agency: 'Insight',
      fullStop: {},
      isEditingForm: false,
      isOnlineAndAuthenticated: true,
      loadingPii: false,
      mappedFormBeats: [],
      mappedFormCountyCities: [],
      mappedFormNonCountyCities: [],
      mappedFormSchools: [],
      mappedFormStatutes: [],
      officerId: '2021050812345',
      stop: {},
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

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    validateLocationForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        const trimmedTextValue = textValue.trim()
        this.loadingPii = true
        let isFound = false
        isFound = trimmedTextValue.includes('John Doe')
        this.stop = Object.assign({}, this.stop)
        if (this.stop.location) {
          this.stop.location.piiFound = isFound
        }
        this.loadingPii = false
        this.updateFullStop()
      }
    },

    validateReasonForStopForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        this.loadingPii = true
        let isFound = false
        isFound = textValue.includes('John Doe')
        this.stop = Object.assign({}, this.stop)
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
        this.loadingPii = false
        this.updateFullStop()
      }
    },

    validateBasisForSearchForPii(textValue) {
      if (this.isOnlineAndAuthenticated && textValue && textValue !== '') {
        this.loadingPii = true
        let isFound = false
        isFound = textValue.includes('John Doe')
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

  created() {
    this.getFormData()
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
