<template>
  <div class="ripa-search tw-p-4">
    <ripa-form-header title="Was a search conducted?" required>
    </ripa-form-header>

    <v-switch
      v-model="model.switch"
      :label="label"
      :items="switchItems"
      @input="handleInput"
    >
    </v-switch>

    <template v-if="model.switch === 1">
      <div>
        <ripa-form-header
          subtitle="Was a search not conducted due to consent not given?"
        >
        </ripa-form-header>

        <ripa-radio-group
          v-model="model.consent"
          :items="consentItems"
          @input="handleInput"
        ></ripa-radio-group>
      </div>
    </template>

    <template v-if="model.switch === 2">
      <div>
        <ripa-form-header subtitle="What was searched?"> </ripa-form-header>
        <ripa-check-group
          v-model="model.search"
          :items="searchItems"
          @input="handleInput"
        >
        </ripa-check-group>
      </div>

      <div class="tw-mt-4">
        <ripa-form-header subtitle="What was the basis of the search?">
        </ripa-form-header>
        <ripa-check-group
          v-model="model.searchBasis"
          :items="searchBasisItems"
          @input="handleInput"
        >
        </ripa-check-group>
      </div>

      <div class="tw-mt-4">
        <ripa-text-area
          v-model="model.explanation"
          hint="Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc."
          label="Please include a brief explanation"
          :rules="explanationRules"
          @input="handleInput"
        ></ripa-text-area>
      </div>
    </template>
  </div>
</template>

<script>
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaTextArea from '@/components/atoms/RipaTextArea'

export default {
  name: 'ripa-search',

  components: {
    RipaCheckGroup,
    RipaFormHeader,
    RipaRadioGroup,
    RipaTextArea,
  },

  data() {
    return {
      valid: true,
      switchItems: [
        { name: 'No', value: 1 },
        { name: 'Yes', value: 2 },
      ],

      consentItems: [
        { name: 'Yes', value: '1A' },
        { name: 'No', value: '1B' },
      ],

      searchItems: [
        { name: 'Person', value: '2A' },
        { name: 'Property', value: '2B' },
      ],

      searchBasisItems: [
        { name: 'Consent given', value: '3A' },
        { name: 'Officer safety/safety of others', value: '3B' },
        { name: 'Search warrant', value: '3C' },
        { name: 'Condition of parole/probation/PRCS', value: '3D' },
        { name: 'Suspected weapons', value: '3E' },
        { name: 'Visible contraband', value: '3F' },
        { name: 'Odor of contraband', value: '3G' },
        { name: 'Canine detention', value: '3H' },
        { name: 'Evidence of a crime', value: '3I' },
        { name: 'Incident to arrest', value: '3J' },
        { name: 'Exigent circumstances/emergency', value: '3K' },
      ],

      explanationRules: [
        v => (v || '').length > 0 || 'Explanation is required',
        v => (v || '').length <= 250 || 'Max 250 characters',
      ],

      viewModel: {
        switch: this.value.switch || null,
        consentItems: this.value.consentItems || null,
        searchItems: this.value.searchItems || null,
        explanation: this.value.explanation || null,
        searchBasisItems: (this.viewModel.searchBasisItems = []),
      },
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
      if (this.viewModel.switch === 1) {
        this.viewModel.consentItems = []
      }

      if (this.viewModel.switch === 2) {
        this.viewModel.searchItems = null
        this.viewModel.searchBasisItems = null
      }
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
