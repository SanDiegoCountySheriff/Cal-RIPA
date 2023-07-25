<template>
  <div class="ripa-race tw-py-4">
    <ripa-form-header title="Edit Stop Explanation" required>
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-combobox
            v-model="model.editStopExplanation"
            label="Edit Stop Explanation"
            hint="Please enter an explanation for editing the stop or choose an existing option"
            :items="[
              'PII Override - false positive',
              'Incorrect information added',
            ]"
            persistent-hint
            :rules="explanationRules"
            @input="handleInput"
          >
          </v-combobox>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-edit-stop-explanation',

  components: {
    RipaFormHeader,
    RipaTextInput,
  },

  data() {
    return {
      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ],
      viewModel: this.value,
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

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
