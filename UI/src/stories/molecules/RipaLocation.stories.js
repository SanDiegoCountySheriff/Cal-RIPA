import RipaLocation from '@/components/molecules/RipaLocation'
import { schools } from '../data/schools'
import { beats } from '../data/beats'
import { cities } from '../data/cities'

export default {
  title: 'Molecules/RipaLocation',
  component: RipaLocation,
  parameters: {},
}

export const basic = () => ({
  components: { RipaLocation },
  data() {
    return {
      stop: {},
      schools: schools
        .sort((x, y) => {
          const schoolA = x.name.toUpperCase()
          const schoolB = y.name.toUpperCase()
          return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
        })
        .map(item => {
          return {
            ...item,
            fullName: `${item.name} (${item.district}) ${item.cdsCode}`,
          }
        }),
      beats: beats
        .sort((x, y) => {
          const beatA = x.command.toUpperCase()
          const beatB = y.command.toUpperCase()
          return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
        })
        .map(item => {
          return {
            ...item,
            fullName: `${item.command} ${item.id}`,
          }
        }),
      cities: cities.sort((x, y) => {
        const cityA = x.name.toUpperCase()
        const cityB = y.name.toUpperCase()
        return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
      }),
    }
  },
  template:
    '<div><ripa-location v-model="stop" :schools="schools" :beats="beats" :cities="cities"></ripa-location>{{stop}}</div>',
})
