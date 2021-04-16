<template>
  <ripa-page-container :admin="admin">
    <ripa-stops-template :items="items"></ripa-stops-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'
import { stops } from '../data/stops'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaPageContainer,
    RipaStopsTemplate,
  },

  data() {
    return {
      items: stops,
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
