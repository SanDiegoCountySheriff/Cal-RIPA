import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid'
import { schools } from '../data/schools'
import { counties } from '../data/counties'

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
      counties: counties,
    }
  },
  template:
    '<ripa-schools-grid :items="data" :counties="counties"></ripa-schools-grid>',
})
