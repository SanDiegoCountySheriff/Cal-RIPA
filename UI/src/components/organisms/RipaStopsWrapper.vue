<template>
  <div>
    <ripa-form-header :title="getTitle"></ripa-form-header>
    <ripa-accordion :items="items"></ripa-accordion>
  </div>
</template>

<script>
import RipaAccordion from '@/components/molecules/RipaAccordion'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-stops-wrapper',

  components: {
    RipaAccordion,
    RipaFormHeader,
  },

  computed: {
    getTitle() {
      return `Last ${this.items.length} Stops`
    },
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
