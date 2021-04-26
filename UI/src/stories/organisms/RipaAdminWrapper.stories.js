import RipaAdminWrapper from '@/components/organisms/RipaAdminWrapper'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { statutes } from '../data/statutes'
import { stops } from '../data/stops'
import { submissions } from '../data/submissions'

export default {
  title: 'Organisms/RipaAdminWrapper',
  component: RipaAdminWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAdminWrapper },
  data() {
    return {
      beats: beats,
      cities: cities,
      schools: schools,
      statutes: statutes,
      stops: stops,
      submissions: submissions,
    }
  },
  template:
    '<ripa-admin-wrapper :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :stops="stops" :submissions="submissions"></ripa-admin-wrapper>',
})

export const loading = () => ({
  components: { RipaAdminWrapper },
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
    '<ripa-admin-wrapper loading :beats="beats" :cities="cities" :schools="schools" :statutes="statutes" :stops="stops" :submissions="submissions"></ripa-admin-wrapper>',
})
