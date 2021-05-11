<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      :beats="beats"
      :county-cities="countyCities"
      :full-stop="fullStop"
      :last-location="lastLocation"
      :loading-pii="loadingPii"
      :non-county-cities="nonCountyCities"
      :schools="schools"
      :statutes="statutes"
      :valid-last-location="validLastLocation"
      :on-add-person="onAddPerson"
      :on-cancel="onCancel"
      :on-delete-person="onDeletePerson"
      :on-open-favorite="onOpenFavorite"
      :on-save-favorite="onSaveFavorite"
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
    fullStop: {
      type: Object,
      default: () => {},
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    loadingPii: {
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
    onOpenFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
