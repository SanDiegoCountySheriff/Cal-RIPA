import RipaUsersGrid from '@/components/molecules/RipaUsersGrid'
import { adminUsers } from '../data/mappings'

export default {
  title: 'Molecules/RipaUsersGrid',
  component: RipaUsersGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaUsersGrid },
  data() {
    return {
      data: adminUsers(),
    }
  },
  template: '<ripa-users-grid :items="data"></ripa-users-grid>',
})

export const loading = () => ({
  components: { RipaUsersGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-users-grid loading :items="data"></ripa-users-grid>',
})
