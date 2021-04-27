<template>
  <div class="ripa-officer tw-p-4">
    <ripa-form-header title="Officer Years of Experience" required>
    </ripa-form-header>

    <ripa-number-input
      v-model="model.years"
      label="Years of Experience"
      required
      @input="handleInput"
    >
    </ripa-number-input>

    <ripa-select
      v-model="model.assignment"
      label="Officer Assignment"
      :items="assignmentItems"
      itemText="name"
      itemValue="value"
      :rules="assignmentRules"
      @input="handleInput"
    >
    </ripa-select>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSelect from '@/components/atoms/RipaSelect'
import { OFFICER_ASSIGNMENTS } from '@/constants/form'

export default {
  name: 'ripa-officer',

  components: {
    RipaFormHeader,
    RipaNumberInput,
    RipaSelect,
  },

  data() {
    return {
      valid: true,
      assignmentRules: [v => !!v || 'An assignment is required'],
      assignmentItems: OFFICER_ASSIGNMENTS,
      viewModel: {
        years: this.value?.years || null,
        assignment: this.value?.assignment || null,
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
