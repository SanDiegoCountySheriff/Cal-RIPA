<template>
  <div class="ripa-agency-questions tw-pb-4">
    <ripa-form-header title="Agency Questions" :required="isRequired">
    </ripa-form-header>

    <v-container>
      <v-row
        no-gutters
        v-for="(question, index) in model.agencyQuestions"
        :key="index"
      >
        <v-col cols="12" sm="12">
          <ripa-text-input
            v-model="question.answer"
            :label="question.label"
            :hint="question.hint"
            :rules="questionRules"
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-agency-questions',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaTextInput,
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

    isRequired() {
      return (
        this.viewModel.agencyQuestions.filter(item => item.required).length > 0
      )
    },

    questionRules() {
      return [v => !!v || 'An answer is required']
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.value)
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
