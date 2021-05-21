<template>
  <div class="ripa-race tw-pb-8">
    <ripa-form-header
      title="Perceived Race or Ethnicity"
      required
      subtitle="§999.226(a)(4)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-check-group
            v-model="model.person.perceivedRace"
            :items="raceItems"
            :rules="raceRules"
            @input="handleInput"
          >
          </ripa-check-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import { RACES } from '@/constants/form'

export default {
  name: 'ripa-race',

  mixins: [RipaFormMixin],

  components: {
    RipaCheckGroup,
    RipaFormHeader,
  },

  data() {
    return {
      raceItems: RACES,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    raceRules() {
      const options = this.viewModel.person.perceivedRace
      return [options.length > 0 || 'At least one race is required']
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
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
