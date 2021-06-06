<template>
  <div class="ripa-race tw-py-4">
    <ripa-form-header title="Edit Stop Explanation" required>
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-text-input
            v-model="model.editStopExplanation"
            label="Edit Stop Explanation"
            hint="Please enter an explanation for editing the stop"
            :rules="explanationRules"
            @input="handleInput"
          >
          </ripa-text-input>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-edit-stop-explanation',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaTextInput,
  },

  data() {
    return {
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 3 || 'Min 5 characters',
      ],
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
  },
}
</script>
