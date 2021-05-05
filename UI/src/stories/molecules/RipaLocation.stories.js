import RipaLocation from '@/components/molecules/RipaLocation'
import { formBeats, formCities, formSchools } from '../data/mappings'

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
      cities: formCities(),
    }
  },
  template:
    '<div><ripa-location v-model="stop" :schools="schools" :beats="beats" :cities="cities"></ripa-location>{{stop}}</div>',
})
