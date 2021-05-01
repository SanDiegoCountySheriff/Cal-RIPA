import RipaActionsTaken from '@/components/molecules/RipaActionsTaken'

export default {
  title: 'Molecules/RipaActionsTaken',
  component: RipaActionsTaken,
  parameters: {},
}

export const basic = () => ({
  components: { RipaActionsTaken },
  data() {
    return {
      actionsTaken: {},
    }
  },
  template:
    '<div><ripa-actions-taken v-model="actionsTaken"></ripa-actions-taken>{{actionsTaken}}</div>',
})
