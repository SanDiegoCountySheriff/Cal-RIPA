import RipaFormStep1 from '@/components/organisms/RipaFormStep1'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
} from '../data/mappings'

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
      countyCities: formCountyCities(),
      nonCountyCities: formNonCountyCities(),
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
    '<div><ripa-form-step1 v-model="stop" :schools="schools" :county-cities="countyCities" :non-county-cities="nonCountyCities" :beats="beats"></ripa-form-step1>{{stop}}</div>',
})
