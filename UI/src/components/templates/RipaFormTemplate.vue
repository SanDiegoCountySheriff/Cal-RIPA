<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      :beats="beats"
      :county-cities="countyCities"
      :loading-pii="loadingPii"
      :non-county-cities="nonCountyCities"
      :schools="schools"
      :statutes="statutes"
      :on-add-person="onAddPerson"
      :on-delete-person="onDeletePerson"
      :on-edit-person="onEditPerson"
      :on-edit-stop="onEditStop"
      :on-cancel="onCancel"
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
    onAddPerson: {
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
    onEditStop: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
