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
import { mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'
import AuthService from '../../services/auth'

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
    ...mapGetters(['isAdmin', 'isAuthenticated', 'apiConfig', 'isOnline']),
  },

  methods: {
    ...mapActions([
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'setApiConfig',
    ]),

    async getFormData() {
      this.loading = true
      await Promise.all([
        this.getFormBeats(),
        this.getFormCities(),
        this.getFormSchools(),
        this.getFormStatutes(),
      ])
      this.loading = false
    },

    getDarkFromLocalStorage() {
      const value = localStorage.getItem('ripa_dark_theme')
      if (value === null) {
        return true
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
      if (this.isAuthenticated && this.isOnline && cacheDate !== null) {
        const hours = differenceInHours(new Date(), new Date(cacheDate))
        if (hours > 23) {
          this.clearLocalStorage()
        }
      }

      if (cacheDate === null) {
        this.clearLocalStorage()
      }
    },

    clearLocalStorage() {
      localStorage.removeItem('ripa_beats')
      localStorage.removeItem('ripa_county_cities')
      localStorage.removeItem('ripa_non_county_cities')
      localStorage.removeItem('ripa_schools')
      localStorage.removeItem('ripa_statutes')
      localStorage.setItem('ripa_cache_date', new Date())
    },
  },

  async created() {
    console.log('pageContainer mounted')
    this.checkCache()
    if (this.apiConfig === null) {
      await AuthService.getApiConfig().then(res => {
        this.setApiConfig({
          apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
          apiSubscription: res.data.Configuration.Subscription,
        })
        console.log('api config set in page container')
        this.getFormData()
      })
    }
  },
}
</script>
