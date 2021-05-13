<template>
  <div class="ripa-race tw-pb-8">
    <ripa-form-header title="Student" required subtitle="§999.224(a)(16)">
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.isStudent"
            label="K-12 Public School Student"
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-student',

  mixins: [RipaFormMixin],

  components: {
    RipaSwitch,
    RipaFormHeader,
  },

  data() {
    return {
      viewModel: this.loadModel(this.value),
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
      this.updateDisabilityModel()
      this.updateStopResultModel()
      this.$emit('input', this.viewModel)
    },

    updateDisabilityModel() {
      this.viewModel.person.anyDisabilities = false
    },

    updateStopResultModel() {
      if (!this.viewModel.person.isStudent) {
        this.viewModel.stopResult.actionsTakenDuringStop12 = false
        this.viewModel.stopResult.actionsTakenDuringStop13 = false
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
    },

    'viewModel.person.isStudent': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.updateDisabilityModel()
          this.updateStopResultModel()
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
