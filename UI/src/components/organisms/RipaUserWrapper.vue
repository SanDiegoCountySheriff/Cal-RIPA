<template>
  <v-card class="mx-auto my-12" max-width="600">
    <ripa-officer v-model="model"></ripa-officer>
  </v-card>
</template>

<script>
import RipaOfficer from '@/components/molecules/RipaOfficer'

export default {
  name: 'ripa-user-wrapper',

  components: {
    RipaOfficer,
  },

  data() {
    return {
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
      set(newVal) {
        this.viewModel = newVal
        this.$emit('input', newVal)
      },
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
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
