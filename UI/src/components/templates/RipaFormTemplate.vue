<template>
  <div class="ripa-form-template">
    {{ stop }}
    <ripa-form-wrapper
      v-model="stop"
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :offense-codes="offenseCodes"
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
      stop: {
        stopDate: {
          duration: 1,
        },
      },
    }
  },

  methods: {
    handleInput(newVal) {
      this.stop = newVal
      this.$forceUpdate()
    },
  },

  props: {
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
    offenseCodes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
