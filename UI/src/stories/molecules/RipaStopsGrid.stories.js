import RipaStopsGrid from '@/components/molecules/RipaStopsGrid'
import { stops } from '../data/stops'
import { format } from 'date-fns'

export default {
  title: 'Molecules/RipaStopsGrid',
  component: RipaStopsGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsGrid },
  data() {
    return {
      data: stops.map(item => {
        return {
          ...item,
          stopDateInt: item.stopDate ? new Date(item.stopDate).getTime() : null,
          stopDateStr: item.stopDate
            ? format(new Date(item.stopDate), 'yyyy-MM-dd kk:mm')
            : null,
        }
      }),
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
