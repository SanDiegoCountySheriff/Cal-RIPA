<template>
  <ripa-page-wrapper :admin="admin" :online="isOnline">
    <slot></slot>
  </ripa-page-wrapper>
</template>

<script>
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ripa-page-container',

  components: {
    RipaPageWrapper,
  },

  computed: {
    ...mapState(['isAdmin']),
    ...mapGetters(['isOnline']),

    admin() {
      return this.isAdmin
    },
  },
}
</script>
