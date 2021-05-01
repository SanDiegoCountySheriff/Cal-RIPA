<template>
  <div class="ripa-disability tw-pb-8">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      subtitle="§999.226(a)(9)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.person.perceivedOrKnownDisability"
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
        person: {
          perceivedOrKnownDisability:
            this.value?.person?.perceivedOrKnownDisability || [],
        },
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
      if (this.viewModel.person.perceivedOrKnownDisability.includes(0)) {
        return this.disabilityItems.filter(item => item.value === 0)
      }

      return this.disabilityItems
    },
  },

  methods: {
    handleInput() {
      if (this.viewModel.person.perceivedOrKnownDisability.includes(0)) {
        this.viewModel.person.perceivedOrKnownDisability = [0]
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
