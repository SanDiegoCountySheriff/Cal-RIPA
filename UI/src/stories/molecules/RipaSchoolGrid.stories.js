import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid'
import { schools } from '../data/schools'

export default {
  title: 'Molecules/RipaSchoolsGrid',
  component: RipaSchoolsGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSchoolsGrid },
  data() {
    return {
      data: schools
        .filter(item => item.status === 'Active')
        .map(item => {
          return {
            name: item.name.toUpperCase(),
            district: item.district.toUpperCase(),
            county: item.county.toUpperCase(),
          }
        }),
    }
  },
  template: '<ripa-schools-grid :items="data"></ripa-schools-grid>',
})

export const loading = () => ({
  components: { RipaSchoolsGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-schools-grid loading :items="data"></ripa-schools-grid>',
})
