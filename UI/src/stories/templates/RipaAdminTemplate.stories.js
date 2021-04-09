import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { statutes } from '../data/statutes'

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
    }
  },
  template:
    '<ripa-admin-template :beats="beats" :cities="cities" :schools="schools" :statutes="statutes"></ripa-admin-template>',
})

export const loading = () => ({
  components: { RipaAdminTemplate },
  data() {
    return {
      beats: [],
      cities: [],
      schools: [],
      statutes: [],
    }
  },
  template:
    '<ripa-admin-template loading :beats="beats" :cities="cities" :schools="schools" :statutes="statutes"></ripa-admin-template>',
})
