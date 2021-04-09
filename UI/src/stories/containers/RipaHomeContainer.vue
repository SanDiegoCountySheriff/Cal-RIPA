<template>
  <ripa-page-container>
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
}
</script>
