<template>
  <div class="ripa-no-english tw-p-4">
    <ripa-form-header
      title="Limited or No English Fluency"
      required
      subtitle="§999.226(a)(8)"
    >
    </ripa-form-header>

    <ripa-checkbox
      v-model="model.checkbox"
      cbLabel="Limited or no english fluency"
      @input="handleInput"
    >
    </ripa-checkbox>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'

export default {
  name: 'ripa-no-english',

  components: {
    RipaFormHeader,
    RipaCheckbox,
  },

  data() {
    return {
      valid: true,
      viewModel: {
        checkbox: this.value.checkbox || false,
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
