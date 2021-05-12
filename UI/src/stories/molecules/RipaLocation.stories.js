import RipaLocation from '@/components/molecules/RipaLocation'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
} from '../data/mappings'

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
      schools: formSchools(),
      beats: formBeats(),
      countyCities: formCountyCities(),
      nonCountyCities: formNonCountyCities(),
    }
  },
  template:
    '<div><ripa-location v-model="stop" :schools="schools" :beats="beats" :county-cities="countyCities" :non-county-cities="nonCountyCities></ripa-location>{{stop}}</div>',
})
