<template>
  <div class="ripa-disability tw-pb-8">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      subtitle="§999.226(a)(9)"
    >
    </ripa-form-header>

    <ripa-switch
      v-model="model.person.anyDisabilities"
      label="Any Disabilities?"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <templave v-if="model.person.anyDisabilities">
      <ripa-check-group
        v-model="model.person.perceivedOrKnownDisability"
        :items="disabilityItems"
        @input="handleInput"
      >
      </ripa-check-group>
    </templave>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { DISABILITIES } from '@/constants/form'

export default {
  name: 'ripa-disability',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      disabilityItems: DISABILITIES,
      viewModel: {
        person: {
          anyDisabilities: this.value?.person?.anyDisabilities || false,
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
  },

  methods: {
    handleInput() {
      this.updatePerceivedOrKnownDisabilityModel()
      this.$emit('input', this.viewModel)
    },

    updatePerceivedOrKnownDisabilityModel() {
      if (!this.viewModel.person.anyDisabilities) {
        this.viewModel.person.perceivedOrKnownDisability = []
      }
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
