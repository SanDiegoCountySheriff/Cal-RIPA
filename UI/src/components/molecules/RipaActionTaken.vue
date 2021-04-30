<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Any actions taken during this stop?"
      required>
    </ripa-form-header>

    <v-switch
     v-model="model.switch"
     :label="label"
     @input="handleInput">
    </v-switch>

    <template v-if="model.switch === 1">
      <div></div>
    </template>

    <template v-if="model.switch === 2">
      <div>
        <ripa-check-group
          v-model="model.actionTaken"
          :items="actionTakenItems"
          @input="handleInput">
        </ripa-check-group>
      </div>
    </template>

  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'

export default {
  name: 'ripa-action-taken',

  components: {
    RipaFormHeader,
    RipaSwitch,
    RipaCheckGroup,
  },

  data() {
    return {
      valid: true,
      actionTakenItems: [
        { name: 'Person removed from vehicle by order', value: '1' },
        { name: 'Person removed from vehicle by physical contact', value: '2' },
        { name: 'Field sobriety test conducted', value: '3' },
        { name: 'Curbside detention', value: '4' },
        { name: 'Handcuffed or flex cuffed', value: '5' },
        { name: 'Patrol car detention', value: '6' },
        { name: 'Firearm pointed at person', value: '7' },
        { name: 'Firearm discharged or used', value: '8' },
        { name: 'Electronic control device used', value: '9' },
        { name: 'Impact projectile discharged or used', value: '10' },
        { name: 'Canine bit or held person', value: '11' },
        { name: 'Baton or other impact weapon used', value: '12' },
        { name: 'Chemical spray used', value: '13' },
        { name: 'Physical or vehicle contact', value: '14' },
        { name: 'Personal photographed', value: '15' },
        { name: 'Vehicle impounded', value: '16' },
      ],
      viewModel: {
        switch: this.value.switch || null,
        actionTaken: this.value.actionTaken || [],
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
      if (this.viewModel.switch === 1) {
         this.viewModel.actionTaken = []
      }
      if (this.viewModel.switch === 2) {
         this.viewModel.actionTaken = null
         this.viewModel.switch = 'yes'
      }
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

