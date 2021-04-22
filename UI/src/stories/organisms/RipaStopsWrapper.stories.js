import RipaStopsWrapper from '@/components/organisms/RipaStopsWrapper'
import { stops } from '../data/stops'

export default {
  title: 'Organisms/RipaStopsWrapper',
  component: RipaStopsWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsWrapper },
  data() {
    return {
      items: stops,
    }
  },
  template: '<ripa-stops-wrapper :items="items"></ripa-stops-wrapper>',
})
