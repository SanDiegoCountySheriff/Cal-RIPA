<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
    >
    </ripa-form-header>

    <ripa-switch
      v-model="model.actionsTaken.anyActionsTaken"
      label="Any Actions Taken?"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <template v-if="model.actionsTaken.anyActionsTaken">
      <ripa-check-group
        v-model="model.actionsTaken.actionsTakenDuringStop"
        :items="actionTakenGeneralItems"
        @input="handleInput"
      >
      </ripa-check-group>

      <ripa-subheader text="Search"></ripa-subheader>

      <ripa-check-group
        v-model="model.actionsTaken.actionsTakenDuringStop"
        :items="actionTakenSearchItems"
        @input="handleInput"
      >
      </ripa-check-group>

      <ripa-subheader text="Seizure"></ripa-subheader>

      <ripa-switch
        v-model="model.actionsTaken.propertyWasSeized"
        label="Property was Seized"
        :max-width="200"
        @input="handleInput"
      ></ripa-switch>

      <template v-if="model.actionsTaken.propertyWasSeized">
        <ripa-form-subheader
          title="Basis for Property Seizure"
          required
          subtitle="§999.226(a)(12)(D)(1)"
        ></ripa-form-subheader>

        <ripa-check-group
          v-model="model.actionsTaken.basisForPropertySeizure"
          :items="basisForPropertySeizureItems"
          @input="handleInput"
        >
        </ripa-check-group>

        <ripa-form-subheader
          title="Types of Property Seized"
          required
          subtitle="§999.226(a)(12)(D)(2)"
        ></ripa-form-subheader>

        <ripa-check-group
          v-model="model.actionsTaken.typesOfPropertySeized"
          :items="propertySeizedTypeItems"
          @input="handleInput"
        >
        </ripa-check-group>
      </template>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormSubheader from '@/components/molecules/RipaFormSubheader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import {
  ACTIONS_TAKEN_GENERAL,
  ACTIONS_TAKEN_SEARCH,
  BASIS_FOR_PROPERTY_SEIZURE,
  CONTRABAND_TYPES,
} from '@/constants/form'

export default {
  name: 'ripa-action-taken',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaFormSubheader,
    RipaSubheader,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      stopReason: this.value?.stopReason || null,
      actionTakenGeneralItems: ACTIONS_TAKEN_GENERAL,
      actionTakenSearchItems: ACTIONS_TAKEN_SEARCH,
      basisForPropertySeizureItems: BASIS_FOR_PROPERTY_SEIZURE,
      propertySeizedTypeItems: CONTRABAND_TYPES,
      viewModel: {
        actionsTaken: {
          anyActionsTaken: this.value?.actionsTaken?.anyActionsTaken || false,
          actionsTakenDuringStop:
            this.value?.actionsTaken?.actionsTakenDuringStop || [],
          propertyWasSeized:
            this.value?.actionsTaken?.propertyWasSeized || false,
          basisForPropertySeizure:
            this.value?.actionsTaken?.basisForPropertySeizure || [],
          typesOfPropertySeized:
            this.value?.actionsTaken?.typesOfPropertySeized || [],
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
      this.updateActionsTakenModel()
      this.updateBasisForPropertySeizedModel()
      this.$emit('input', this.viewModel)
    },

    updateActionsTakenModel() {
      if (!this.viewModel.actionsTaken.anyActionsTaken) {
        this.viewModel.actionsTaken.actionsTakenDuringStop = []
        this.viewModel.actionsTaken.propertyWasSeized = false
      }
    },

    updateBasisForPropertySeizedModel() {
      if (!this.viewModel.actionsTaken.propertyWasSeized) {
        this.viewModel.actionsTaken.basisForPropertySeizure = []
        this.viewModel.actionsTaken.typesOfPropertySeized = []
      }
    },
  },

  watch: {
    value(newVal) {
      this.stopReason = newVal.stopReason || null
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    items: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
