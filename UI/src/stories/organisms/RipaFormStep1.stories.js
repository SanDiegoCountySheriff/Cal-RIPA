import RipaFormStep1 from '@/components/organisms/RipaFormStep1'
import { formBeats, formCities, formSchools } from '../data/mappings'

export default {
  title: 'Organisms/RipaFormStep1',
  component: RipaFormStep1,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep1 },
  data() {
    return {
      schools: formSchools(),
      beats: formBeats(),
      cities: formCities(),
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
