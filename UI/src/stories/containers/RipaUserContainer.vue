<template>
  <ripa-page-container :admin="admin">
    <div>USER TEMPLATE GOES HERE</div>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'

export default {
  name: 'ripa-user-container',

  components: {
    RipaPageContainer,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
