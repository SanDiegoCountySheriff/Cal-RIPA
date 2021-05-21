<template>
  <ripa-officer-stops-wrapper :items="items"></ripa-officer-stops-wrapper>
</template>

<script>
import RipaOfficerStopsWrapper from '@/components/organisms/RipaOfficerStopsWrapper'

export default {
  name: 'ripa-officer-stops-template',

  components: {
    RipaOfficerStopsWrapper,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
