import RipaPersonDialog from '@/components/molecules/RipaPersonDialog'
import { stopPersonsContent } from '@/stories/data/formStop'

export default {
  title: 'Molecules/RipaPersonDialog',
  component: RipaPersonDialog,
  parameters: {},
}

export const basic = () => ({
  components: { RipaPersonDialog },
  computed: {
    getPersons() {
      return stopPersonsContent
    },
  },
  template:
    '<ripa-person-dialog show-dialog :persons="getPersons"></ripa-person-dialog>',
})
