<template>
  <div class="ripa-action-taken tw-pb-8">
    <ripa-form-header
      title="Contraband or Evidence Discovered"
      required
      subtitle="§999.226(a)(12)(C)"
    >
    </ripa-form-header>

    <v-container>
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
              :rules="contrabandRules"
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { CONTRABAND_TYPES } from '@/constants/form'

export default {
  name: 'ripa-contraband',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      contrabandItems: CONTRABAND_TYPES,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    contrabandRules() {
      const checked = this.viewModel.actionsTaken.anyContraband
      const options = this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered
      return [
        (checked && options.length > 0) ||
          'At least one contraband is required',
      ]
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },

    updateContrabandOrEvidenceDiscoveredModel() {
      this.$nextTick(() => {
        this.viewModel.actionsTaken.contrabandOrEvidenceDiscovered = []
      })
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
    },

    'viewModel.actionsTaken.anyContraband': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.updateContrabandOrEvidenceDiscoveredModel()
        }
      },
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
