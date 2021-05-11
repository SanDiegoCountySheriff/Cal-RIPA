import RipaOfficerStopsWrapper from '@/components/organisms/RipaOfficerStopsWrapper'
import { officerStops } from '../data/officerStops'

export default {
  title: 'Organisms/RipaOfficerStopsWrapper',
  component: RipaOfficerStopsWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaOfficerStopsWrapper },
  data() {
    return {
      items: officerStops,
    }
  },
  template:
    '<ripa-officer-stops-wrapper :items="items"></ripa-officer-stops-wrapper>',
})
