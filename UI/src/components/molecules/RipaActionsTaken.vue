<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Actions Taken During Stop"
      required
      subtitle="§999.226(a)(12)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.actionsTaken"
      :items="getActionsTakenItems"
      @input="handleInput"
    >
    </ripa-check-group>

    <template v-if="!isNoneSelected">
      <ripa-subheader text="Search"></ripa-subheader>

      <ripa-check-group
        v-model="model.actionsTaken"
        :items="actionTakenSearchItems"
        @input="handleInput"
      >
      </ripa-check-group>

      <ripa-subheader text="Seizure"></ripa-subheader>

      <ripa-switch
        v-model="model.propertyWasSeized"
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
      actionTakenGeneralItems: ACTIONS_TAKEN_GENERAL,
      actionTakenSearchItems: ACTIONS_TAKEN_SEARCH,
      viewModel: {
        actionsTaken: this.value?.actionTaken || [],
        propertyWasSeized: this.value?.propertyWasSeized || false,
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
      return this.viewModel.actionsTaken.includes(0)
    },

    getActionsTakenItems() {
      if (this.viewModel.actionsTaken.includes(0)) {
        return this.actionTakenGeneralItems.filter(item => item.value === 0)
      }

      return this.actionTakenGeneralItems
    },
  },

  methods: {
    handleInput() {
      // if (this.viewModel.switch === 1) {
      //   this.viewModel.actionTaken = []
      // }
      // if (this.viewModel.switch === 2) {
      //   this.viewModel.actionTaken = null
      //   this.viewModel.switch = 'yes'
      // }
      this.$emit('input', this.viewModel)
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
