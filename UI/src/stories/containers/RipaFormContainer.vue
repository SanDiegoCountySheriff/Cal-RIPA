<template>
  <ripa-page-container :admin="admin">
    <div>FORM TEMPLATE GOES HERE</div>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'

export default {
  name: 'ripa-form-container',

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
