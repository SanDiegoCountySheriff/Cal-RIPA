<template>
  <div class="ripa-no-english tw-pb-8">
    <ripa-form-header
      title="Limited or No English Fluency"
      required
      subtitle="§999.226(a)(8)"
    >
    </ripa-form-header>

    <ripa-switch
      v-model="model.perceivedLimitedEnglish"
      label="Limited or no English fluency"
      :max-width="300"
      @input="handleInput"
    ></ripa-switch>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-limited-english',

  components: {
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      viewModel: {
        perceivedLimitedEnglish: this.value?.perceivedLimitedEnglish || false,
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
