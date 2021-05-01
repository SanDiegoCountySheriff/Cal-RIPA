import RipaFormStep1 from '@/components/organisms/RipaFormStep1'
import { schools } from '../data/schools'
import { beats } from '../data/beats'
import { cities } from '../data/cities'

export default {
  title: 'Organisms/RipaFormStep1',
  component: RipaFormStep1,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep1 },
  data() {
    return {
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
      stop: {
        officer: {
          yearsExperience: 8,
          assignment: 4,
        },
        stopDate: {
          duration: 2,
        },
      },
    }
  },
  template:
    '<div><ripa-form-step1 v-model="stop" :schools="schools" :cities="cities" :beats="beats"></ripa-form-step1>{{stop}}</div>',
})
