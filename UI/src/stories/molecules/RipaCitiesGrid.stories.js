import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import { cities } from '../data/cities'
import { STATES } from '@/constants/states'
import { COUNTIES } from '@/constants/counties'

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
      counties: COUNTIES,
      states: STATES,
    }
  },
  template:
    '<ripa-cities-grid :items="data" :counties="counties" :states="states"></ripa-cities-grid>',
})

export const loading = () => ({
  components: { RipaCitiesGrid },
  data() {
    return {
      data: cities,
      counties: COUNTIES,
      states: STATES,
    }
  },
  template:
    '<ripa-cities-grid loading :items="data" :counties="counties" :states="states"></ripa-cities-grid>',
})
