<template>
  <ripa-page-wrapper
    :admin="isAdmin"
    :display-environment="displayEnvironment"
    :environment-name="environmentName"
    :online="isOnlineAndAuthenticated"
    :authenticated="isOnlineAndAuthenticated"
    :dark="isDark"
    :invalidUser="invalidUser"
    :on-update-dark="handleUpdateDark"
    :on-update-user="handleUpdateUser"
    @handleLogOut="handleLogOut"
    @handleLogIn="handleLogIn"
  >
    <slot></slot>
    <ripa-interval
      :delay="stopInternalMs"
      @tick="checkLocalStorage"
    ></ripa-interval>

    <ripa-user-dialog
      :is-invalid-user="isOnlineAndAuthenticated && invalidUser"
      :user="getMappedUser"
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
import authentication from '@/authentication'

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
      'displayEnvironment',
      'environmentName',
      'isAdmin',
      'invalidUser',
      'isOnline',
      'isOnlineAndAuthenticated',
      'isAuthenticated',
      'apiConfig',
      'mappedUser',
    ]),

    getMappedUser() {
      return {
        agency: this.mappedUser.agency,
        assignment: this.mappedUser.assignment,
        otherType: this.mappedUser.otherType,
        startDate: this.mappedUser.startDate,
        yearsExperience: this.mappedUser.yearsExperience,
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
      'setInvalidUser',
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

    handleSaveUser(user) {
      this.editOfficerUser(user)
    },

    handleUpdateDark(value) {
      this.isDark = value
      this.setDarkToLocalStorage()
    },

    handleLogOut() {
      authentication.signOut()
    },

    handleLogIn() {
      authentication.signIn()
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

    async updateData() {
      this.checkCache()
      await this.getUserData()
      await this.getFormData()
    },
  },

  async created() {
    if (this.isOnlineAndAuthenticated) {
      this.updateData()
    }
  },

  watch: {
    invalidUser(newVal) {
      if (newVal && this.isOnline && !this.isAuthenticated) {
        this.showUserDialog = true
      } else {
        this.checkCache()
      }
    },
  },
}
</script>
