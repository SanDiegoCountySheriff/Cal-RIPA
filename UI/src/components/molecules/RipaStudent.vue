<template>
  <div class="ripa-race tw-pb-4">
    <ripa-form-header
      title="Student"
      required
      subtitle="§999.224(a)(16)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.isStudent"
            label="K-12 Public School Student"
            :disabled="disabled"
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
  name: 'ripa-student',

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
      this.updateStopReasonModel()
      this.clearDisabilityModel()
      this.updateStopResultModel()
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
    },

    'viewModel.person.isStudent': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.clearDisabilityModel()
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
