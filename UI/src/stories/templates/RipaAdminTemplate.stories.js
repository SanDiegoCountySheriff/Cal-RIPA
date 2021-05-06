import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import {
  adminBeats,
  adminCities,
  adminSchools,
  adminStatutes,
} from '../data/mappings'
import { stops } from '../data/stops'
import { submissions } from '../data/submissions'

export default {
  title: 'Templates/RipaAdminTemplate',
  component: RipaAdminTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAdminTemplate },
  data() {
    return {
      beats: adminBeats(),
      cities: adminCities(),
      schools: adminSchools(),
      statutes: adminStatutes(),
      stops: stops,
      submissions: submissions,
    }
  },
  template:
    '<ripa-admin-template :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :stops="stops" :submissions="submissions"></ripa-admin-template>',
})

export const loading = () => ({
  components: { RipaAdminTemplate },
  data() {
    return {
      beats: [],
      cities: [],
      schools: [],
      statutes: [],
      stops: [],
      submissions: [],
    }
  },
  template:
    '<ripa-admin-template loading :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :stops="stops" :submissions="submissions"></ripa-admin-template>',
})
