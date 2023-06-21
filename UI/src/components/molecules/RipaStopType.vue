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
            :display-row="true"
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

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    stopTypeRules() {
      return [v => !!v || 'A stop type is required']
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
      required: true,
    },
  },
}
</script>
