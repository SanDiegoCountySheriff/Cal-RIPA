import RipaStopsWithErrorsDialog from '@/components/molecules/RipaStopsWithErrorsDialog'
import { stopPersonsContent } from '@/stories/data/formStop'

export default {
  title: 'Molecules/RipaStopsWithErrorsDialog',
  component: RipaStopsWithErrorsDialog,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsWithErrorsDialog },
  computed: {
    getPersons() {
      return stopPersonsContent
    },
  },
  template:
    '<ripa-stops-with-errors-dialog show-dialog :persons="getPersons"></ripa-stops-with-errors-dialog>',
})
