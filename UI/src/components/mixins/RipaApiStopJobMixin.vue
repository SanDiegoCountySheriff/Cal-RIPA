<script>
export default {
  data() {
    return { isLocked: false }
  },

  methods: {
    addApiStop(apiStop) {
      this.isLocked = true
      const apiStops = this.getApiStopsFromLocalStorage()
      apiStops.push(apiStop)
      this.setApiStopsToLocalStorage(apiStops)
      this.isLocked = false
    },

    checkLocalStorage() {
      if (!this.isLocked && this.isOnlineAndAuthenticated) {
        this.isLocked = true
        const apiStops = this.getApiStopsFromLocalStorage()
        if (apiStops.length > 0) {
          this.runApiStopsJob(apiStops)
        }
        this.isLocked = false
      }
    },

    async runApiStopsJob(apiStops) {
      this.resetStopSubmissionStatus()
      if (this.isOnlineAndAuthenticated) {
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          await this.editOfficerStop(apiStop)
        }

        const stopIdsPassedStr = `Stop ID(s) Passed: ${this.mappedStopSubmissionPassedIds.join(
          ', ',
        )}.`
        const stopIdsFailedStr = `Stop ID(s) Failed: ${this.mappedStopSubmissionFailedIds.join(
          ', ',
        )}.`
        this.snackbarText = `${this.mappedStopSubmissionStatus}. ${stopIdsPassedStr} ${stopIdsFailedStr}`
        this.snackbarVisible = true

        this.updateApiStopsLocalStorage()
      }
    },

    updateApiStopsLocalStorage() {
      // if no failed ids, everything worked so cleear local storage
      if (this.mappedStopSubmissionFailedIds.length === 0) {
        this.removeApiStopsFromLocalStorage()
      }

      // if there are failed ids, filter all failed apiStop ids and reset to local storage
      if (this.mappedStopSubmissionFailedIds.length > 0) {
        const apiStops = this.getApiStopsFromLocalStorage()
        const filteredApiStops = apiStops.filter(item =>
          this.mappedStopSubmissionFailedIds.includes(item),
        )
        this.setApiStopsToLocalStorage(filteredApiStops)
      }
    },

    removeApiStopsFromLocalStorage() {
      localStorage.removeItem('ripa_submitted_api_stops')
    },

    getApiStopsFromLocalStorage() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },
  },

  props: {
    onRun: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
