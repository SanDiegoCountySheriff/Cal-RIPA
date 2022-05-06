<template>
  <div>
    <ripa-form-header
      title="Type of Stop"
      required
      subtitle="§999.226(a)(7)"
      :on-open-statue="onOpenStatute"
    ></ripa-form-header>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-radio-group
            v-model="model.stopType"
            :items="stopTypes"
            :rules="stopTypeRules"
            :display-row="true"
            @input="handleInput"
          ></ripa-radio-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'

export default {
  name: 'ripa-stop-type',

  mixins: [RipaModelMixin],

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
      viewModel: this.syncModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    stopTypeRules() {
      return [v => !!v || 'A stop type is required']
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
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
