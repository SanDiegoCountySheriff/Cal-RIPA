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
          <template v-if="model.stopVersion === 1">
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
          </template>

          <template v-else>
            <ripa-switch
              v-model="model.nonForceActionsTaken.anyContraband"
              label="Any Contraband or Evidence Discovered?"
              :disabled="isAnyContrabandDisabled"
              :max-width="350"
            ></ripa-switch>

            <template v-if="model.nonForceActionsTaken.anyContraband">
              <ripa-check-group
                v-model="
                  model.nonForceActionsTaken.contrabandOrEvidenceDiscovered
                "
                :items="contrabandItems"
                :rules="contrabandRules"
              >
              </ripa-check-group>
            </template>
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
      if (this.model.stopVersion === 1) {
        const checked = this.model.actionsTaken.anyContraband
        const options = this.model.actionsTaken.contrabandOrEvidenceDiscovered
        return [
          (checked && options.length > 0) ||
            'At least one contraband is required',
        ]
      } else {
        const checked = this.model.nonForceActionsTaken.anyContraband
        const options =
          this.model.nonForceActionsTaken.contrabandOrEvidenceDiscovered
        return [
          (checked && options.length > 0) ||
            'At least one contraband is required',
        ]
      }
    },

    isAnyContrabandDisabled() {
      if (this.model.stopVersion === 1) {
        return (
          this.model.actionsTaken.basisForPropertySeizure.includes(2) ||
          this.model.actionsTaken.basisForPropertySeizure.includes(3)
        )
      } else {
        return (
          this.model.nonForceActionsTaken.basisForPropertySeizure.includes(2) ||
          this.model.nonForceActionsTaken.basisForPropertySeizure.includes(3)
        )
      }
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

    'model.nonForceActionsTaken.anyContraband': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.$nextTick(() => {
            this.model.nonForceActionsTaken.contrabandOrEvidenceDiscovered = []
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
