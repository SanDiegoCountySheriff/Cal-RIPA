<template>
  <div class="ripa-action-taken tw-pb-4">
    <ripa-form-header
      title="Contraband or Evidence Discovered"
      required
      subtitle="§999.226(a)(12)(C)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.actionsTaken.anyContraband"
            label="Any Contraband or Evidence Discovered?"
            :disabled="isAnyContrabandDisabled"
            :max-width="350"
          ></ripa-switch>

          <template v-if="model.actionsTaken.anyContraband">
            <ripa-check-group
              v-model="model.actionsTaken.contrabandOrEvidenceDiscovered"
              :items="contrabandItems"
              :rules="contrabandRules"
            >
            </ripa-check-group>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { CONTRABAND_TYPES } from '@/constants/form'

export default {
  name: 'ripa-contraband',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSwitch,
  },

  data() {
    return {
      contrabandItems: CONTRABAND_TYPES,
    }
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

    contrabandRules() {
      const checked = this.model.actionsTaken.anyContraband
      const options = this.model.actionsTaken.contrabandOrEvidenceDiscovered
      return [
        (checked && options.length > 0) ||
          'At least one contraband is required',
      ]
    },

    isAnyContrabandDisabled() {
      return (
        this.model.actionsTaken.basisForPropertySeizure.includes(2) ||
        this.model.actionsTaken.basisForPropertySeizure.includes(3)
      )
    },
  },

  watch: {
    'model.actionsTaken.anyContraband': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.$nextTick(() => {
            this.model.actionsTaken.contrabandOrEvidenceDiscovered = []
          })
        }
      },
    },

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
  },
}
</script>
