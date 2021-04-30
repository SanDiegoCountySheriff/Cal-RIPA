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
      actionTaken: {
        getLabelText: 'no',
      },
    }
  },
  template:
    '<div"><ripa-actions-taken v-model="actionTaken"></ripa-actions-taken>{{getLabelText}}</div>',
})
