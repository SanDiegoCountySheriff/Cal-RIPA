import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'
import { stops } from '../data/stops'

export default {
  title: 'Templates/RipaStopsTemplate',
  component: RipaStopsTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsTemplate },
  data() {
    return {
      items: stops,
    }
  },
  template: '<ripa-stops-template :items="items"></ripa-stops-template>',
})
