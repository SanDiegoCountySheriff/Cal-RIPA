import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import { cities } from '../data/cities'
import { states } from '../data/states'

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
      states: states,
    }
  },
  template:
    '<ripa-cities-grid :items="data" :states="states"></ripa-cities-grid>',
})
