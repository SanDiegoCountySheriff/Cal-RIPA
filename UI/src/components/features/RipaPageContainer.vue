<template>
  <ripa-page-wrapper
    :admin="user.isAdmin"
    :online="isOnline"
    :dark="isDark"
    :on-update-dark="handleUpdateDark"
  >
    <slot></slot>
  </ripa-page-wrapper>
</template>

<script>
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import { mapState, mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'

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
    ...mapState(['user']),
    ...mapGetters([
      'isOnline',
      'mappedBeats',
      'mappedCities',
      'mappedSchools',
      'mappedStatutes',
    ]),
  },

  methods: {
    ...mapActions(['getBeats', 'getCities', 'getSchools', 'getStatutes']),

    async getAdminData() {
      this.loading = true
      await Promise.all([
        this.getBeats(),
        this.getCities(),
        this.getSchools(),
        this.getStatutes(),
      ])
      this.loading = false
    },

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

    checkCache() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      if (cacheDate !== null) {
        const hours = differenceInHours(new Date(), new Date(cacheDate))
        if (hours > 23) {
          localStorage.removeItem('ripa_beats')
          localStorage.removeItem('ripa_cities')
          localStorage.removeItem('ripa_schools')
          localStorage.removeItem('ripa_statutes')
          localStorage.setItem('ripa_cache_date', new Date())
        }
      }
    },
  },

  created() {
    this.checkCache()
    this.getAdminData()
  },
}
</script>
