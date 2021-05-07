<template>
  <div class="ripa-home-container">
    <template v-if="!isEditingForm">
      <ripa-intro-template :on-template="handleTemplate"></ripa-intro-template>
    </template>
    <template v-if="isEditingForm">
      <v-divider></v-divider>
      <div class="tw-my-4">
        {{ fullStop }}
      </div>
      <v-divider></v-divider>
      <div class="tw-my-4">
        {{ stop }}
      </div>
      <v-divider></v-divider>

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
  </div>
</template>

<script>
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import RipaHomeContainerMixin from '@/components/mixins/RipaHomeContainerMixin'
import RipaIntroTemplate from '@/components/templates/RipaIntroTemplate'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-home-container',

  mixins: [RipaHomeContainerMixin],

  components: {
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
    ]),
  },

  methods: {
    ...mapActions(['checkTextForPii']),

    handleSubmit() {
      console.log('LONG STOP FORM SUBMITTED', this.fullStop)
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
        this.stop.updated = new Date()
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
}
</script>
