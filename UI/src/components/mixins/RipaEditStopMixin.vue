<script>
import {
  apiStopToFullStop,
  apiStopToFullStopV2,
  fullStopToStop,
  fullStopToStopV2,
} from '@/utilities/stop'

export default {
  methods: {
    handleEditStopByAdmin(apiStop, route) {
      const submissions = apiStop.listSubmission || []
      const sortedSubmissions = submissions.sort(
        (a, b) =>
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime(),
      )
      const fullStop =
        apiStop.stopVersion === 1 ||
        apiStop.stopVersion === undefined ||
        apiStop.stopVersion === null
          ? apiStopToFullStop(apiStop)
          : apiStopToFullStopV2(apiStop)

      const stop =
        fullStop.stopVersion === 1
          ? fullStopToStop(fullStop)
          : fullStopToStopV2(fullStop)

      if (fullStop.stopVersion === 1) {
        localStorage.setItem('ripa_form_step_index', '7')
      } else {
        localStorage.setItem('ripa_form_step_index', '8')
      }
      localStorage.setItem('ripa_form_admin_editing', '1')
      localStorage.setItem('ripa_form_editing', '1')
      localStorage.setItem('ripa_form_edit_route', route)
      localStorage.setItem('ripa_form_stop', JSON.stringify(stop))
      localStorage.setItem('ripa_form_full_stop', JSON.stringify(fullStop))
      localStorage.setItem('ripa_form_api_stop', JSON.stringify(apiStop))
      localStorage.setItem(
        'ripa_form_submitted_api_stop',
        JSON.stringify(apiStop),
      )
      localStorage.setItem(
        'ripa_form_submitted_submissions',
        JSON.stringify(sortedSubmissions),
      )
      this.$router.push('/')
      console.log('Edit API Stop', apiStop)
      console.log('Edit Full Stop', fullStop)
      console.log('Edit Stop', stop)
    },

    handleViewStopByAdmin(apiStop, route) {
      const submissions = apiStop.listSubmission || []
      const sortedSubmissions = submissions.sort(
        (a, b) =>
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime(),
      )
      const fullStop =
        apiStop.stopVersion === 1 ||
        apiStop.stopVersion === undefined ||
        apiStop.stopVersion === null
          ? apiStopToFullStop(apiStop)
          : apiStopToFullStopV2(apiStop)

      const stop =
        fullStop.stopVersion === 1
          ? fullStopToStop(fullStop)
          : fullStopToStopV2(fullStop)

      if (fullStop.stopVersion === 1) {
        localStorage.setItem('ripa_form_step_index', '7')
      } else {
        localStorage.setItem('ripa_form_step_index', '8')
      }
      localStorage.setItem('ripa_form_admin_viewing', '1')
      localStorage.setItem('ripa_form_editing', '1')
      localStorage.setItem('ripa_form_edit_route', route)
      localStorage.setItem('ripa_form_stop', JSON.stringify(stop))
      localStorage.setItem('ripa_form_full_stop', JSON.stringify(fullStop))
      localStorage.setItem('ripa_form_api_stop', JSON.stringify(apiStop))
      localStorage.setItem(
        'ripa_form_submitted_api_stop',
        JSON.stringify(apiStop),
      )
      localStorage.setItem(
        'ripa_form_submitted_submissions',
        JSON.stringify(sortedSubmissions),
      )
      this.$router.push('/')
      console.log('View API Stop', apiStop)
      console.log('View Full Stop', fullStop)
      console.log('View Stop', stop)
    },

    handleEditStopWithError(apiStop, internalId) {
      const submissions = apiStop.listSubmission || []
      const sortedSubmissions = submissions.sort(
        (a, b) =>
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime(),
      )
      const fullStop =
        apiStop.stopVersion === 1
          ? apiStopToFullStop(apiStop)
          : apiStopToFullStopV2(apiStop)

      const stop =
        fullStop.stopVersion === 1
          ? fullStopToStop(fullStop)
          : fullStopToStopV2(fullStop)

      localStorage.setItem('ripa_errored_stop_internal_id', internalId)
      if (fullStop.stopVersion === 1) {
        localStorage.setItem('ripa_form_step_index', '7')
      } else {
        localStorage.setItem('ripa_form_step_index', '8')
      }
      localStorage.setItem('ripa_form_editing', '1')
      localStorage.setItem('ripa_form_editing_stop_with_error', '1')
      localStorage.setItem('ripa_form_stop', JSON.stringify(stop))
      localStorage.setItem('ripa_form_full_stop', JSON.stringify(fullStop))
      localStorage.setItem('ripa_form_api_stop', JSON.stringify(apiStop))
      localStorage.setItem(
        'ripa_form_submitted_api_stop',
        JSON.stringify(apiStop),
      )
      localStorage.setItem(
        'ripa_form_submitted_submissions',
        JSON.stringify(sortedSubmissions),
      )
      this.$router.push('/initializing')
      setTimeout(() => {
        this.$router.push('/')
      }, 500)
      console.log('Edit API Stop with Error', apiStop)
      console.log('Edit Full Stop with Error', fullStop)
      console.log('Edit Stop with Error', stop)
    },
  },
}
</script>
