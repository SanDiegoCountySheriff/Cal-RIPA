<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      isLocked: false,
      locationSource: 'Location',
      basisForSearchSource: 'Basis for Search Person: ',
      stopReasonSource: 'Stop Reason Person: ',
      snackbarText: '',
      snackbarNoErrorsVisible: false,
      snackbarErrorsVisible: false,
      apiStopJobLoading: false,
    }
  },

  computed: {
    ...mapGetters([
      'mappedStopSubmissionStatus',
      'mappedStopSubmissionPassedIds',
      'mappedStopSubmissionFailedStops',
    ]),
  },

  methods: {
    ...mapActions([
      'checkTextForPii',
      'setPiiServiceAvailable',
      'submitOfficerStop',
      'resetStopSubmissionStatus',
    ]),

    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    getApiStopsFromLocalStorage() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    getApiStopsWithErrorsFromLocalStorage() {
      const apiStops = localStorage.getItem(
        'ripa_submitted_api_stops_with_errors',
      )
      const parsedApiStops = apiStops ? JSON.parse(apiStops) : []

      return parsedApiStops
    },

    pushFailedStopsToStopsWithErrors(apiStops) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const updatedApiStops = apiStopsWithErrors.concat(apiStops)

      this.setApiStopsWithErrorsToLocalStorage(updatedApiStops)
    },

    setApiStopsWithErrorsToLocalStorage(apiStops) {
      if (apiStops.length === 0) {
        localStorage.removeItem('ripa_submitted_api_stops_with_errors')
      } else {
        localStorage.setItem(
          'ripa_submitted_api_stops_with_errors',
          JSON.stringify(apiStops),
        )
      }
    },

    deleteStopWithError(internalId) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const updatedApiStopsWithErrors = apiStopsWithErrors.filter(
        item => item.internalId !== internalId,
      )
      this.setApiStopsWithErrorsToLocalStorage(updatedApiStopsWithErrors)
      this.setStopsWithErrors(apiStopsWithErrors)
    },
  },
}
</script>
