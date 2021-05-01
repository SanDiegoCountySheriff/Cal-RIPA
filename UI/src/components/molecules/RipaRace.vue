<template>
  <div class="ripa-race tw-pb-8">
    <ripa-form-header
      title="Perceived Race or Ethnicity"
      required
      subtitle="§999.226(a)(4)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.person.perceivedRace"
      :items="raceItems"
      @input="handleInput"
    >
    </ripa-check-group>
  </div>
</template>

<script>
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import { RACES } from '@/constants/form'

export default {
  name: 'ripa-race',

  components: {
    RipaCheckGroup,
    RipaFormHeader,
  },

  data() {
    return {
      raceItems: RACES,
      viewModel: {
        person: {
          perceivedRace: this.value?.person?.perceivedRace || [],
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
