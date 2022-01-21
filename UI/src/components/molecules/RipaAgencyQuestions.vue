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
            :label="question.prompt"
            :hint="question.hint"
            :rules="questionRules(question)"
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
  name: 'ripa-agency-questions',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaTextInput,
  },

  data() {
    return {
      viewModel: this.syncModel(this.value),
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
  },

  methods: {
    handleInput() {
      this.$emit('input', this.value)
    },

    questionRules(question) {
      return [
        v => !!v || 'An answer is required',
        v =>
          (v || '').length <= question.maxLength ||
          `Max ${question.maxLength} characters`,
      ]
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
