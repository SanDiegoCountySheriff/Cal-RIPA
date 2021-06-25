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
          this.removeApiStopsFromLocalStorage()
        }
        this.isLocked = false
      }
    },

    getApiStopsFromLocalStorage() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    removeApiStopsFromLocalStorage() {
      localStorage.removeItem('ripa_submitted_api_stops')
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
