<template>
  <div class="ripa-disability tw-pb-8">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      subtitle="§999.226(a)(9)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.disability"
      :items="getDisabilityItems"
      @input="handleInput"
    >
    </ripa-check-group>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import { DISABILITIES } from '@/constants/form'

export default {
  name: 'ripa-disability',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
  },

  data() {
    return {
      valid: true,
      disabilityItems: DISABILITIES,
      viewModel: {
        disability: this.value?.disability || [],
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    getDisabilityItems() {
      if (this.viewModel.disability.includes(0)) {
        return this.disabilityItems.filter(item => item.value === 0)
      }

      return this.disabilityItems
    },
  },

  methods: {
    handleInput() {
      if (this.viewModel.disability.includes(0)) {
        this.viewModel.disability = [0]
      }
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
