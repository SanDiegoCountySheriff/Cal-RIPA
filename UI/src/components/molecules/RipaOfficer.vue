<template>
  <div class="ripa-officer tw-p-4">
    <ripa-form-header
      title="Officer Years of Experience"
      required>
    </ripa-form-header>

    <ripa-number-input
      v-model="years"
      label= "Years of Experience"
      required>
    </ripa-number-input>

    <ripa-select
      v-model="assignment"
      label="Officer Assignment"
      :items="assignmentItems"
      :rules="assignmentRules"
    ></ripa-select>
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
      years: null,
      assignment: null,
      assignmentRules: [v => !!v || 'An assignment is required'],
      assignmentItems: [
        { name: 'Patrol, traffic enforcement, field operations', value: 1 },
        { name: 'Gang enforcement', value: 2 },
        { name: 'Compliance check', value: 3, },
        { name: 'Special events', value: 4, },
        { name: 'Roadblock or DUI sobriety checkpoint', value: 5, },
        { name: 'Narcotics/vice', value: 6 },
        { name: 'Task force', value: 7, },
        { name: 'K-12 public school', value: 8, },
        { name: 'Investigative/detective', value: 9, },
        { name: 'Others', value: 10 },
      ],
    }
  },

  computed: {
    getModel() {
      return {
        years: this.years,
        assignment: this.assignment,
      }
    },
  },

  methods: {
    submit() {
      this.$emit('input', {
        years: this.years,
        assignment: this.assignment,
      })
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
