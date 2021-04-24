<template>
  <ripa-page-container :admin="admin">
    <ripa-stops-template :items="items"></ripa-stops-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'
import { officerStops } from '../data/officerStops'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaPageContainer,
    RipaStopsTemplate,
  },

  data() {
    return {
      items: officerStops,
    }
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
