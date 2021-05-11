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
        :loading-pii="loadingPii"
        :non-county-cities="mappedFormNonCountyCities"
        :schools="mappedFormSchools"
        :statutes="mappedFormStatutes"
        :on-add-person="handleAddPerson"
        :on-cancel="handleCancel"
        :on-delete-person="handleDeletePerson"
        :on-open-favorite="handleOpenFavorite"
        :on-save-favorite="handleSaveFavorite"
        :on-submit="handleSubmit"
        @input="handleInput"
      ></ripa-form-template>
    </template>

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
    RipaFormTemplate,
    RipaIntroTemplate,
    RipaPageContainer,
  },

  data() {
    return {
      agency: 'Insight',
      fullStop: {},
      isAuthenticated: true,
      isEditingForm: false,
      isOnline: true,
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

    handleCloseDialog() {
      this.showAddFavoriteDialog = false
    },

    handleSubmit(apiStop) {
      this.addApiStop(apiStop)
      this.setLastLocation(this.stop)
    },

    validateReasonForStopForPii(textValue) {
      if (
        this.isOnline &&
        this.isAuthenticated &&
        textValue &&
        textValue !== ''
      ) {
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
      if (
        this.isOnline &&
        this.isAuthenticated &&
        textValue &&
        textValue !== ''
      ) {
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
