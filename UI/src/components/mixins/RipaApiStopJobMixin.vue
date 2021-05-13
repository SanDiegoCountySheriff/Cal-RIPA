<script>
export default {
  data() {
    return { isLocked: false }
  },

  methods: {
    addApiStop(apiStop) {
      this.isLocked = true
      const apiStops = this.getApiStops()
      apiStops.push(apiStop)
      this.setApiStops(apiStops)
      this.isLocked = false
    },

    checkLocalStorage() {
      if (!this.isLocked && this.isOnlineAndAuthenticated) {
        this.isLocked = true
        const apiStops = this.getApiStops()
        if (apiStops.length > 0) {
          this.runApiStopsJob(apiStops)
          this.removeApiStops()
        }
        this.isLocked = false
      }
    },

    getApiStops() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    setApiStops(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    removeApiStops() {
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
