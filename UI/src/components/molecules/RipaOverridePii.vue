<template>
  <div class="ripa-override-pii tw-pb-4">
    <ripa-form-header title="Override PII"> </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          Is PII Found: {{ apiStop.isPiiFound }}
        </v-col>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.overridePii"
            label="Override"
            :max-width="250"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-override-pii',

  mixins: [RipaModelMixin],

  components: {
    RipaSwitch,
    RipaFormHeader,
  },

  data() {
    return {
      viewModel: this.updateModel(this.value),
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
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    apiStop: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
