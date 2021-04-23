import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { statutes } from '../data/statutes'
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
      beats: beats,
      cities: cities,
      schools: schools,
      statutes: statutes,
      submissions: submissions,
    }
  },
  template:
    '<ripa-admin-template :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :submissions="submissions"></ripa-admin-template>',
})

export const loading = () => ({
  components: { RipaAdminTemplate },
  data() {
    return {
      beats: [],
      cities: [],
      schools: [],
      statutes: [],
      submissions: [],
    }
  },
  template:
    '<ripa-admin-template loading :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :submissions="submissions"></ripa-admin-template>',
})
