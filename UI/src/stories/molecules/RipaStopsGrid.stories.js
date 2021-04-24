import RipaStopsGrid from '@/components/molecules/RipaStopsGrid'
import { stops } from '../data/stops'

export default {
  title: 'Molecules/RipaStopsGrid',
  component: RipaStopsGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsGrid },
  data() {
    return {
      data: stops,
    }
  },
  template: '<ripa-stops-grid :items="data"></ripa-stops-grid>',
})

export const loading = () => ({
  components: { RipaStopsGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-stops-grid loading :items="data"></ripa-stops-grid>',
})
