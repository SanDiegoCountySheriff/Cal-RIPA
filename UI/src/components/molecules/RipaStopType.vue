<template>
  <div>
    <ripa-form-header
      title="Type of Stop"
      required
      subtitle="§999.226(a)(2)"
      v-on="$listeners"
    ></ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-radio-group
            v-model="model.stopType"
            :items="stopTypes"
            :rules="stopTypeRules"
            @input="handleInput"
            display-row
          ></ripa-radio-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
export default {
  name: 'ripa-stop-type',

  components: {
    RipaFormHeader,
    RipaRadioGroup,
  },

  data() {
    return {
      stopTypes: [
        { name: 'Vehicular', value: 'Vehicular' },
        { name: 'Bicycle', value: 'Bicycle' },
        { name: 'Pedestrian', value: 'Pedestrian' },
      ],
    }
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.model)
    },

    updateModel() {
      if (this.model.stopType !== 'Pedestrian') {
        this.model.person.insideResidence = null
      }

      if (this.model.stopType !== 'Vehicular') {
        this.model.person.passengerInVehicle = null
        this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
            action => {
              return action !== 4 && action !== 13
            },
          )
      }
    },
  },

  computed: {
    model: {
      get() {
        return this.value
      },
    },

    stopTypeRules() {
      return [v => !!v || 'A stop type is required']
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
