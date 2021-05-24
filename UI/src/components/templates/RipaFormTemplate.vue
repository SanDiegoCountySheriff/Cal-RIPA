<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      :beats="beats"
      :county-cities="countyCities"
      :display-beat-input="displayBeatInput"
      :form-step-index="formStepIndex"
      :full-stop="fullStop"
      :last-location="lastLocation"
      :loading-gps="loadingGps"
      :loading-pii-step1="loadingPiiStep1"
      :loading-pii-step3="loadingPiiStep3"
      :loading-pii-step4="loadingPiiStep4"
      :non-county-cities="nonCountyCities"
      :schools="schools"
      :statutes="statutes"
      :valid-last-location="validLastLocation"
      :on-add-person="onAddPerson"
      :on-cancel="onCancel"
      :on-delete-person="onDeletePerson"
      :on-edit-person="onEditPerson"
      :on-gps-location="onGpsLocation"
      :on-open-favorites="onOpenFavorites"
      :on-open-last-location="onOpenLastLocation"
      :on-open-statute="onOpenStatute"
      :on-save-favorite="onSaveFavorite"
      :on-step-index-change="onStepIndexChange"
      :on-submit="onSubmit"
      @input="handleInput"
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
    formStepIndex: {
      type: Number,
      default: 1,
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    lastLocation: {
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
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
    onOpenFavorites: {
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
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
    onStepIndexChange: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
