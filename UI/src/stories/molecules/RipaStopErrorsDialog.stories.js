import RipaStopErrorsDialog from '@/components/molecules/RipaStopErrorsDialog'
import { stopPersonsContent } from '@/stories/data/formStop'

export default {
  title: 'Molecules/RipaStopErrorsDialog',
  component: RipaStopErrorsDialog,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopErrorsDialog },
  computed: {
    getPersons() {
      return stopPersonsContent
    },
  },
  template:
    '<ripa-stop-errors-dialog show-dialog :persons="getPersons"></ripa-stop-errors-dialog>',
})
