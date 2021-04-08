import RipaStopReason from '@/components/molecules/RipaStopReason'

export default {
  title: 'Molecules/RipaStopReason',
  component: RipaStopReason,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopReason },
  data() {
    return {
      stopReason: {
        name: 'spietrek',
      },
    }
  },
  template:
    '<div><ripa-stop-reason v-model="stopReason"></ripa-stop-reason>{{stopReason}}</div>',
})
