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
      stop: {},
    }
  },
  template:
    '<div><ripa-actions-taken v-model="stop"></ripa-actions-taken>{{stop}}</div>',
})
