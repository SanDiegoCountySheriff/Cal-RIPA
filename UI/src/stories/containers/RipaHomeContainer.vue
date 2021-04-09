<template>
  <ripa-page-container :admin="admin">
    <ripa-home-template></ripa-home-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaHomeTemplate from '@/components/templates/RipaHomeTemplate'

export default {
  name: 'ripa-home-container',

  components: {
    RipaPageContainer,
    RipaHomeTemplate,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
