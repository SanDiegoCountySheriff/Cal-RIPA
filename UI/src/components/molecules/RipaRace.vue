<template>
  <div class="ripa-race tw-pb-4">
    <ripa-form-header
      title="Perceived Race or Ethnicity"
      required
      :subtitle="model.stopVersion === 1 ? '§999.226(a)(4)' : '§999.226(a)(5)'"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-check-group
            v-model="model.person.perceivedRace"
            :disabled="disabled"
            :items="raceItems"
            :rules="raceRules"
          >
          </ripa-check-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import { RACES, RACES_V2 } from '@/constants/form'

export default {
  name: 'ripa-race',

  components: {
    RipaCheckGroup,
    RipaFormHeader,
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    raceRules() {
      const options = this.model.person.perceivedRace
      return [options.length > 0 || 'At least one race is required']
    },

    raceItems() {
      if (this.model.stopVersion === 1) {
        return RACES
      }
      return RACES_V2
    },
  },

  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
