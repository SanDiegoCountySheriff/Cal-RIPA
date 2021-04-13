<template>
  <ripa-page-container :admin="admin">
    <ripa-stops-template></ripa-stops-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'

export default {
  name: 'ripa-stops-container',

  components: {
    RipaPageContainer,
    RipaStopsTemplate,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
