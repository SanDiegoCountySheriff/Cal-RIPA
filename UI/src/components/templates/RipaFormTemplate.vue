<template>
  <div class="ripa-form-template">
    <ripa-form-wrapper
      v-model="stop"
      v-on="$listeners"
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
    onSubmitStop: {
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
