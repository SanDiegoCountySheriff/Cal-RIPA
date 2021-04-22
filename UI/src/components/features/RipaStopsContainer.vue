<template>
  <ripa-stops-template :items="items"></ripa-stops-template>
</template>

<script>
import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaStopsTemplate,
  },

  data() {
    return {
      items: [],
    }
  },
}
</script>
