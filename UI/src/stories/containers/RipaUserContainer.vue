<template>
  <ripa-page-container :admin="admin">
    <ripa-user-template></ripa-user-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaUserTemplate from '@/components/templates/RipaUserTemplate'

export default {
  name: 'ripa-user-container',

  components: {
    RipaPageContainer,
    RipaUserTemplate,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
