<template>
  <ripa-page-container :admin="admin">
    <vue-confirm-dialog></vue-confirm-dialog>
    <!-- <v-divider></v-divider>
    <div class="tw-my-4">
      {{ fullStop }}
    </div>
    <v-divider></v-divider>
    <div class="tw-my-4">
      {{ stop }}
    </div>
    <v-divider></v-divider> -->

    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>

    <template v-if="isEditingForm">
      <ripa-form-template
        v-model="stop"
        :beats="mappedFormBeats"
        :county-cities="mappedFormCountyCities"
        :loading-pii="loadingPii"
        :non-county-cities="mappedFormNonCountyCities"
        :schools="mappedFormSchools"
        :statutes="mappedFormStatutes"
        :on-add-person="handleAddPerson"
        :on-cancel="handleCancel"
        :on-delete-person="handleDeletePerson"
        :on-submit="handleSubmit"
        @input="handleInput"
      ></ripa-form-template>
    </template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaHomeContainerMixin from '@/components/mixins/RipaHomeContainerMixin'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  name: 'ripa-home-container',

  mixins: [RipaHomeContainerMixin],

  components: {
    RipaPageContainer,
    RipaFormTemplate,
    RipaIntroTemplate,
  },

  data() {
    return {
      fullStop: {},
      isEditingForm: false,
      loadingPii: true,
      mappedFormBeats: [],
      mappedFormCountyCities: [],
      mappedFormNonCountyCities: [],
      mappedFormSchools: [],
      mappedFormStatutes: [],
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

    handleSubmit() {
      console.log('LONG STOP FORM SUBMITTED', this.fullStop)
    },

    validateReasonForStopForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        this.loadingPii = true
        let isFound = false
        isFound = textValue.contains('John Doe')
        this.stop = Object.assign({}, this.stop)
        this.stop.updated = new Date()
        if (this.stop.stopReason) {
          this.stop.stopReason.reasonForStopPiiFound = isFound
        }
        this.loadingPii = false
        this.updateFullStop()
      }
    },

    validateBasisForSearchForPii(textValue) {
      if (this.isOnline && this.isAuthenticated && textValue !== '') {
        this.loadingPii = true
        let isFound = false
        isFound = textValue.contains('John Doe')
        this.stop = Object.assign({}, this.stop)
        this.stop.updated = new Date()
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
