<template>
  <ripa-page-container :admin="admin">
    <ripa-form-template></ripa-form-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'

export default {
  name: 'ripa-form-container',

  components: {
    RipaPageContainer,
    RipaFormTemplate,
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
