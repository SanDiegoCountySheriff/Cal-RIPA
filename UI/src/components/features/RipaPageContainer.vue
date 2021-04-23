<template>
  <ripa-page-wrapper
    :admin="isAdmin"
    :online="isOnline"
    :dark="isDark"
    :on-update-dark="handleUpdateDark"
  >
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

  data() {
    return {
      isDark: this.getDarkFromLocalStorage(),
    }
  },

  computed: {
    ...mapState(['isAdmin']),
    ...mapGetters(['isOnline']),
  },

  methods: {
    getDarkFromLocalStorage() {
      const value = localStorage.getItem('ripa_dark_theme')
      if (value === null) {
        return 1
      }
      return value === '1'
    },

    handleUpdateDark(value) {
      this.isDark = value
      this.setDarkToLocalStorage()
    },

    setDarkToLocalStorage() {
      localStorage.setItem('ripa_dark_theme', +this.isDark)
    },
  },
}
</script>
