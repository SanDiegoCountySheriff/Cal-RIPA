import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import { cities } from '../data/cities'

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
    }
  },
  template: '<ripa-cities-grid :items="data"></ripa-cities-grid>',
})

export const loading = () => ({
  components: { RipaCitiesGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-cities-grid loading :items="data"></ripa-cities-grid>',
})
