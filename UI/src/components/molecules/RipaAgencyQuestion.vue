<template>
  <div class="ripa-agency-question tw-pb-4">
    <ripa-form-header
      :required="this.question.Required"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-text-input
            v-model="model"
            :label="this.question.Prompt"
            :hint="this.question.Hint"
            :min="1"
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
  name: 'ripa-agency-question',

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

    questionRules() {
      return [
        v => !!v || 'An answer is required',
        //v => (v !== 'undefined' && ('' + v).length > this.maxLength) || 'Answer must be between 1 and 120 years',
      ]
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
      type: String,
      default: '',
    },
    question: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
