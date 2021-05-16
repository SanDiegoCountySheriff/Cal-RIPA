<template>
  <v-card class="tw-mx-auto" max-width="650">
    <ripa-officer v-model="model" class="tw-p-4"></ripa-officer>
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
        officer: {
          yearsExperience: this.value?.officer?.yearsExperience || null,
          assignment: this.value?.officer.assignment || null,
          otherType: this.value?.officer.otherType || null,
        },
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
