import RipaOfficerStopsTemplate from '@/components/templates/RipaOfficerStopsTemplate'
import { officerStops } from '../data/officerStops'

export default {
  title: 'Templates/RipaOfficerStopsTemplate',
  component: RipaOfficerStopsTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaOfficerStopsTemplate },
  data() {
    return {
      items: officerStops,
    }
  },
  template:
    '<ripa-officer-stops-template :items="items"></ripa-officer-stops-template>',
})
