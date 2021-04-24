<template>
  <div class="ripa-race tw-p-4">
    <ripa-form-header
      title="Perceived Race or Ethnicity"
      required
      subtitle="§999.226(a)(4)"
    >
    </ripa-form-header>

    <ripa-check-group
      v-model="model.raceValues"
      :items="raceItems"
      @input="handleInput"
    >
    </ripa-check-group>
  </div>
</template>

<script>
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-race',

  components: {
    RipaCheckGroup,
    RipaFormHeader,
  },

  data() {
    return {
      raceItems: [
        { name: 'Asian', value: '1' },
        { name: 'Black/African American', value: '2' },
        { name: 'Hispanic/Latino(a)', value: '3' },
        { name: 'Middle Eastern or South Asian', value: '4' },
        { name: 'Native American', value: '5' },
        { name: 'Pacific Islander', value: '6' },
        { name: 'White', value: '7' },
      ],
      viewModel: {
        raceValues: this.value?.raceValues || [],
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
    items: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
