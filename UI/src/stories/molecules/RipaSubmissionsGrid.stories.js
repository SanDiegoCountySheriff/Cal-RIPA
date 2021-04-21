import RipaSubmissionsGrid from '@/components/molecules/RipaSubmissionsGrid'
import { submissions } from '../data/submissions'

export default {
  title: 'Molecules/RipaSubmissionsGrid',
  component: RipaSubmissionsGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSubmissionsGrid },
  data() {
    return {
      data: submissions,
    }
  },
  template: '<ripa-submissions-grid :items="data"></ripa-submissions-grid>',
})

export const loading = () => ({
  components: { RipaSubmissionsGrid },
  data() {
    return {
      data: [],
    }
  },
  template:
    '<ripa-submissions-grid loading :items="data"></ripa-submissions-grid>',
})
