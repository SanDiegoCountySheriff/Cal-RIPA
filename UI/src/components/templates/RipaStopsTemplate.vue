<template>
  <ripa-stops-wrapper :items="items"></ripa-stops-wrapper>
</template>

<script>
import RipaStopsWrapper from '@/components/organisms/RipaStopsWrapper'

export default {
  name: 'ripa-stops-template',

  components: {
    RipaStopsWrapper,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
