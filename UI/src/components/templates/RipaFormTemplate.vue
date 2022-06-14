<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      :admin-editing="adminEditing"
      :admin-viewing="adminViewing"
      :beats="beats"
      :county-cities="countyCities"
      :display-beat-input="displayBeatInput"
      :display-debugger="displayDebugger"
      :form-step-index="formStepIndex"
      :full-stop="fullStop"
      :is-authenticated="isAuthenticated"
      :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
      :is-api-unavailable="isApiUnavailable"
      :last-location="lastLocation"
      :last-reason="lastReason"
      :last-result="lastResult"
      :loading-gps="loadingGps"
      :loading-pii-step1="loadingPiiStep1"
      :loading-pii-step3="loadingPiiStep3"
      :loading-pii-step4="loadingPiiStep4"
      :non-county-cities="nonCountyCities"
      :schools="schools"
      :statutes="statutes"
      :user="user"
      :stopTemplates="stopTemplates"
      :valid-last-location="validLastLocation"
      :on-add-person="onAddPerson"
      :on-cancel-form="onCancelForm"
      :on-cancel-action="onCancelAction"
      :on-copy-person="onCopyPerson"
      :on-delete-person="onDeletePerson"
      :on-edit-agency-questions="onEditAgencyQuestions"
      :on-edit-person="onEditPerson"
      :on-edit-stop="onEditStop"
      :on-gps-location="onGpsLocation"
      :on-open-location-favorites="onOpenLocationFavorites"
      :on-open-reason-favorites="onOpenReasonFavorites"
      :on-open-result-favorites="onOpenResultFavorites"
      :on-save-location-favorite="onSaveLocationFavorite"
      :on-save-reason-favorite="onSaveReasonFavorite"
      :on-save-result-favorite="onSaveResultFavorite"
      :on-open-last-location="onOpenLastLocation"
      :on-open-statute="onOpenStatute"
      :on-open-template="onOpenTemplate"
      :on-step-index-change="onStepIndexChange"
      :on-submit-stop="onSubmitStop"
      :on-update-user="onUpdateUser"
      @handle-done="handleDone"
      @input="handleInput"
      @pii-check="handlePiiCheck"
    ></ripa-form-wrapper>
  </div>
</template>

<script>
import RipaFormWrapper from '@/components/organisms/RipaFormWrapper'

export default {
  name: 'ripa-form-template',

  components: {
    RipaFormWrapper,
  },

  data() {
    return {
      stop: this.value,
    }
  },

  methods: {
    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.$emit('input', this.stop)
    },

    handlePiiCheck({ source, value }) {
      this.$emit('pii-check', { source, value })
    },

    handleDone() {
      this.$emit('handle-done')
    },
  },

  watch: {
    value(newVal) {
      this.stop = newVal
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    adminViewing: {
      type: Boolean,
      default: false,
    },
    beats: {
      type: Array,
      default: () => [],
    },
    countyCities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    displayDebugger: {
      type: Boolean,
      default: false,
    },
    formStepIndex: {
      type: Number,
      default: 1,
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    isApiUnavailable: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    lastReason: {
      type: Object,
      default: () => {},
    },
    lastResult: {
      type: Object,
      default: () => {},
    },
    loadingGps: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep1: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep3: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep4: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    schools: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    stopTemplates: {
      type: Array,
      default: () => [],
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancelForm: {
      type: Function,
      default: () => {},
    },
    onCancelAction: {
      type: Function,
      default: () => {},
    },
    onCopyPerson: {
      type: Function,
      default: () => {},
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
    },
    onEditAgencyQuestions: {
      type: Function,
      default: () => {},
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
    onEditStop: {
      type: Function,
      default: () => {},
    },
    onOpenLocationFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenReasonFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenResultFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenLastLocation: {
      type: Function,
      default: () => {},
    },
    onOpenStatute: {
      type: Function,
      default: () => {},
    },
    onSaveLocationFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveReasonFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveResultFavorite: {
      type: Function,
      default: () => {},
    },
    onStepIndexChange: {
      type: Function,
      default: () => {},
    },
    onSubmitStop: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
    onOpenTemplate: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
