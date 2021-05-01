<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.actionsTaken.actionsTakenDuringStop"
      :items="getActionsTakenItems"
      @input="handleInput"
    >
    </ripa-check-group>

    <template v-if="!isNoneSelected">
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
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { ACTIONS_TAKEN_GENERAL, ACTIONS_TAKEN_SEARCH } from '@/constants/form'

export default {
  name: 'ripa-action-taken',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSubheader,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      stopReason: this.value?.stopReason || null,
      actionTakenGeneralItems: ACTIONS_TAKEN_GENERAL,
      actionTakenSearchItems: ACTIONS_TAKEN_SEARCH,
      viewModel: {
        actionsTaken: {
          actionsTakenDuringStop:
            this.value?.actionsTaken?.actionsTakenDuringStop || [],
          propertyWasSeized:
            this.value?.actionsTaken?.propertyWasSeized || false,
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

    isNoneSelected() {
      return this.viewModel.actionsTaken.actionsTakenDuringStop.includes(0)
    },

    getActionsTakenItems() {
      if (this.viewModel.actionsTaken.actionsTakenDuringStop.includes(0)) {
        return this.actionTakenGeneralItems.filter(item => item.value === 0)
      }

      return this.actionTakenGeneralItems
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
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
