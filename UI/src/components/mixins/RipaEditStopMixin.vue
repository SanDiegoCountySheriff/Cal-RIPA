<script>
import { apiStopToFullStop, fullStopToStop } from '@/utilities/stop'
import router from '@/router'

export default {
  methods: {
    handleEditStopByAdmin(apiStop, route) {
      const submissions = apiStop.listSubmission || []
      const sortedSubmissions = submissions.sort(
        (a, b) =>
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime(),
      )
      const fullStop = apiStopToFullStop(apiStop)
      const stop = fullStopToStop(fullStop)
      localStorage.setItem('ripa_form_step_index', '7')
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
      router.push('/')
      console.log('Edit API Stop', apiStop)
      console.log('Edit Full Stop', fullStop)
      console.log('Edit Stop', stop)
    },

    handleEditStopWithError(apiStop) {
      const submissions = apiStop.listSubmission || []
      const sortedSubmissions = submissions.sort(
        (a, b) =>
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime(),
      )
      const fullStop = apiStopToFullStop(apiStop)
      const stop = fullStopToStop(fullStop)
      localStorage.setItem('ripa_form_step_index', '7')
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
      router.push('/')
      console.log('Edit API Stop With Error', apiStop)
      console.log('Edit Full Stop With Error', fullStop)
      console.log('Edit Stop With Error', stop)
    },
  },
}
</script>
