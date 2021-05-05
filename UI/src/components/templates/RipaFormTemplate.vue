<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :statutes="statutes"
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
      this.stop = newVal
      this.$emit('input', this.stop)
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
    cities: {
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
  },
}
</script>
