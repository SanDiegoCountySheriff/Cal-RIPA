<template>
  <ripa-page-container :admin="admin">
    <ripa-officer-stops-template :items="items"></ripa-officer-stops-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaOfficerStopsTemplate from '@/components/templates/RipaOfficerStopsTemplate'
import { officerStops } from '../data/officerStops'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaPageContainer,
    RipaOfficerStopsTemplate,
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
