import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid'
import { statutes } from '../data/statutes'

export default {
  title: 'Molecules/RipaStatutesGrid',
  component: RipaStatutesGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStatutesGrid },
  data() {
    return {
      data: statutes,
    }
  },
  template: '<ripa-statutes-grid :items="data"></ripa-statutes-grid>',
})

export const loading = () => ({
  components: { RipaStatutesGrid },
  data() {
    return {
      data: statutes,
    }
  },
  template: '<ripa-statutes-grid loading :items="data"></ripa-statutes-grid>',
})
