<template>
  <div class="ripa-age tw-pb-8">
    <ripa-form-header title="Perceived Age" required subtitle="§999.226(a)(7)">
    </ripa-form-header>

    <ripa-select
      v-model="model.age"
      label="Perceived Age"
      :items="ageItems"
      itemText="name"
      itemValue="value"
      @input="handleInput"
    >
    </ripa-select>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSelect from '@/components/atoms/RipaSelect'
import { AGES } from '@/constants/form'

export default {
  name: 'ripa-age',

  components: {
    RipaFormHeader,
    RipaSelect,
  },

  data() {
    return {
      valid: true,
      ageItems: AGES,
      viewModel: {
        age: this.value?.age || null,
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
