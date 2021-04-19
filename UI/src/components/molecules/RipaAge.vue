<template>
  <div class="ripa-age tw-p-4">
    <ripa-form-header title="Perceived Age" 
    required 
    subtitle="§999.226(a)(7)">
    </ripa-form-header>

    <ripa-number-input
      v-model="model.age"
      label="Perceived Age"
      required
      @input="handleInput"
    >
    </ripa-number-input>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'

export default {
  name: 'ripa-age',

  components: {
    RipaFormHeader,
    RipaNumberInput,
  },

  data() {
    return {
      valid: true,
      viewModel: {
        duration: this.value.age || null,
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
