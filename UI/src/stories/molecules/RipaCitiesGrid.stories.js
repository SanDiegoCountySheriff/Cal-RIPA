import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import { cities } from '../data/cities'
import { states } from '../data/states'
import { counties } from '../data/counties'

export default {
  title: 'Molecules/RipaCitiesGrid',
  component: RipaCitiesGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaCitiesGrid },
  data() {
    return {
      data: cities,
      counties: counties,
      states: states,
    }
  },
  template:
    '<ripa-cities-grid :items="data" :counties="counties" :states="states"></ripa-cities-grid>',
})
