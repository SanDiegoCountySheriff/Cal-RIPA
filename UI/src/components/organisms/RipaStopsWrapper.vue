<template>
  <ripa-accordion :items="items"></ripa-accordion>
</template>

<script>
import RipaAccordion from '@/components/molecules/RipaAccordion'

export default {
  name: 'ripa-stops-wrapper',

  components: {
    RipaAccordion,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
