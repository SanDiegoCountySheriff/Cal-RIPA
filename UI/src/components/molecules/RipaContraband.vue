<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Contraband or Evidence Discovered"
      required
      subtitle="§999.226(a)(12)(C)"
    >
    </ripa-form-header>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.actionsTaken.anyContraband"
            label="Any Contraband or Evidence Discovered?"
            :max-width="350"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.actionsTaken.anyContraband">
            <ripa-check-group
              v-model="model.actionsTaken.contrabandOrEvidenceDiscovered"
              :items="contrabandItems"
              @input="handleInput"
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
      valid: true,
      contrabandItems: CONTRABAND_TYPES,
      viewModel: {
        actionsTaken: {
          anyContraband: this.value?.actionsTaken?.anyContraband || false,
          contrabandOrEvidenceDiscovered:
            this.value?.actionsTaken?.contrabandOrEvidenceDiscovered || [],
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
      this.updateContrabandOrEvidenceDiscoveredModel()
      this.$emit('input', this.viewModel)
    },

    updateContrabandOrEvidenceDiscoveredModel() {
      if (!this.viewModel.actionsTaken.anyContraband) {
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = []
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
