<script>
import { apiStopToFullStop, fullStopToStop } from '@/utilities/stop'
import router from '@/router'

export default {
  methods: {
    handleEditStop(apiStop, route) {
      const fullStop = apiStopToFullStop(apiStop)
      const stop = fullStopToStop(fullStop)
      localStorage.setItem('ripa_form_step_index', '7')
      localStorage.setItem('ripa_form_admin_editing', '1')
      localStorage.setItem('ripa_form_editing', '1')
      localStorage.setItem('ripa_form_edit_route', route)
      localStorage.setItem('ripa_form_stop', JSON.stringify(stop))
      localStorage.setItem('ripa_form_full_stop', JSON.stringify(fullStop))
      router.push('/')
    },
  },
}
</script>
