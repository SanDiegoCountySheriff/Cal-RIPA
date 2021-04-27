import RipaActionTaken from '@/components/molecules/RipaActionTaken'

export default {
  title: 'Molecules/RipaActionTaken',
  component: RipaActionTaken,
  parameters: {},
}

export const basic = () => ({
  components: { RipaActionTaken },
  data() {
    return {
      actionTaken: {
        getLabelText: 'no',
      },
    }
  },
  template:
    '<div"><ripa-action-taken v-model="actionTaken"></ripa-action-taken>{{getLabelText}}</div>',
})
