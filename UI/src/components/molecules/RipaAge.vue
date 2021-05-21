<template>
  <div class="ripa-age tw-pb-8">
    <ripa-form-header
      title="Perceived Age"
      required
      subtitle="§999.226(a)(7)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-number-input
            v-model="model.person.perceivedAge"
            label="Perceived Age"
            :min="1"
            :max="1250"
            :rules="ageRules"
            @input="handleInput"
          >
          </ripa-number-input>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import { AGES } from '@/constants/form'

export default {
  name: 'ripa-age',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaNumberInput,
  },

  data() {
    return {
      valid: true,
      ageItems: AGES,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    ageRules() {
      return [
        v => !!v || 'An age is required',
        v => (v >= 1 && v <= 120) || 'Age must be between 1 and 120 years',
      ]
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
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
