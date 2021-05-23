<script>
import { apiStopToFullStop, fullStopToStop } from '@/utilities/stop'
import router from '@/router'

export default {
  methods: {
    handleEditStop(apiStop) {
      const fullStop = apiStopToFullStop(apiStop)
      const stop = fullStopToStop(fullStop)
      localStorage.removeItem('ripa_form_current_user')
      localStorage.setItem('ripa_form_step_index', '6')
      localStorage.setItem('ripa_form_editing', '1')
      localStorage.setItem('ripa_form_stop', JSON.stringify(stop))
      localStorage.setItem('ripa_form_full_stop', JSON.stringify(fullStop))
      router.push('/')
    },
  },
}
</script>
