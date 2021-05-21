<template>
  <ripa-page-wrapper
    :admin="isAdmin"
    :online="isOnlineAndAuthenticated"
    :dark="isDark"
    :invalidUser="invalidUser"
    :on-update-dark="handleUpdateDark"
    :on-update-user="handleUpdateUser"
  >
    <slot></slot>
    <ripa-interval
      :delay="stopInternalMs"
      @tick="checkLocalStorage"
    ></ripa-interval>

    <ripa-user-dialog
      :stop="getStop"
      :show-dialog="showUserDialog"
      :on-close="handleClose"
      :on-save="handleSaveUser"
    ></ripa-user-dialog>

    <ripa-invalid-user-dialog
      :show-dialog="showInvalidUserDialog"
    ></ripa-invalid-user-dialog>
  </ripa-page-wrapper>
</template>

<script>
import RipaApiStopJobMixin from '@/components/mixins/RipaApiStopJobMixin'
import RipaInterval from '@/components/atoms/RipaInterval'
import RipaInvalidUserDialog from '@/components/molecules/RipaInvalidUserDialog'
import RipaPageWrapper from '@/components/organisms/RipaPageWrapper'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { mapGetters, mapActions } from 'vuex'
import differenceInHours from 'date-fns/differenceInHours'

export default {
  name: 'ripa-page-container',

  mixins: [RipaApiStopJobMixin],

  components: {
    RipaInterval,
    RipaInvalidUserDialog,
    RipaPageWrapper,
    RipaUserDialog,
  },

  data() {
    return {
      isDark: this.getDarkFromLocalStorage(),
      stopInternalMs: 5000,
      showInvalidUserDialog: false,
      showUserDialog: false,
    }
  },

  computed: {
    ...mapGetters([
      'isAdmin',
      'invalidUser',
      'isOnlineAndAuthenticated',
      'apiConfig',
      'officer',
    ]),

    getStop() {
      return {
        agency: this.officer.agency,
        officerId: this.officer.officerId,
        officer: {
          assignment: this.officer.assignment,
          otherType: this.officer.otherType,
          startDate: this.officer.startDate,
          yearsExperience: this.officer.yearsExperience,
        },
      }
    },
  },

  methods: {
    ...mapActions([
      'editOfficerStop',
      'editOfficerUser',
      'getFormBeats',
      'getFormCities',
      'getFormSchools',
      'getFormStatutes',
      'getUser',
      'setApiConfig',
    ]),

    async getUserData() {
      await Promise.all([this.getUser()])
    },

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

    handleClose() {
      this.showUserDialog = false
    },

    handleSaveUser(officer) {
      this.editOfficerUser(officer)
    },

    handleUpdateDark(value) {
      this.isDark = value
      this.setDarkToLocalStorage()
    },

    handleUpdateUser() {
      this.showUserDialog = true
    },

    setDarkToLocalStorage() {
      localStorage.setItem('ripa_dark_theme', +this.isDark)
    },

    checkCache() {
      const cacheDate = localStorage.getItem('ripa_cache_date')
      if (this.isOnlineAndAuthenticated && cacheDate !== null) {
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

    async runApiStopsJob(apiStops) {
      if (this.isOnlineAndAuthenticated) {
        for (let index = 0; index < apiStops.length; index++) {
          await this.editOfficerStop(apiStops[index])
        }
      }
    },
  },

  async created() {
    if (this.isOnlineAndAuthenticated) {
      this.getUserData()
    }
  },

  watch: {
    invalidUser(newVal) {
      if (newVal) {
        this.showInvalidUserDialog = true
      } else {
        this.checkCache()
        this.getFormData()
      }
    },
  },
}
</script>
