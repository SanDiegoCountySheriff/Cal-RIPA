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
      assignmentItems: [
        { name: 'Patrol, traffic enforcement, field operations', value: 1 },
        { name: 'Gang enforcement', value: 2 },
        { name: 'Compliance check', value: 3 },
        { name: 'Special events', value: 4 },
        { name: 'Roadblock or DUI sobriety checkpoint', value: 5 },
        { name: 'Narcotics/vice', value: 6 },
        { name: 'Task force', value: 7 },
        { name: 'K-12 public school', value: 8 },
        { name: 'Investigative/detective', value: 9 },
        { name: 'Others', value: 10 },
      ],
      viewModel: {
        years: this.value.years || null,
        assignment: this.value.assignment || null,
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
