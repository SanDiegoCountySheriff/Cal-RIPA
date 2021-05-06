import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid'
import { adminStatutes } from '../data/mappings'

export default {
  title: 'Molecules/RipaStatutesGrid',
  component: RipaStatutesGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStatutesGrid },
  data() {
    return {
      data: adminStatutes(),
    }
  },
  template: '<ripa-statutes-grid :items="data"></ripa-statutes-grid>',
})

export const loading = () => ({
  components: { RipaStatutesGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-statutes-grid loading :items="data"></ripa-statutes-grid>',
})
