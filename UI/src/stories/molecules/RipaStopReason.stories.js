import RipaStopReason from '@/components/molecules/RipaStopReason'
import { statutes } from '../data/statutes'

export default {
  title: 'Molecules/RipaStopReason',
  component: RipaStopReason,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopReason },
  data() {
    return {
      data: statutes.map(item => {
        return {
          ...item,
          fullName: `${item.offenseStatute} ${item.offenseTypeOfStatuteCD} - ${item.statuteLiteral} (${item.offenseTypeOfCharge}) ${item.offenseCode}`,
        }
      }),
      stopReason: {
        name: 'spietrek',
      },
    }
  },
  template:
    '<div><ripa-stop-reason v-model="stopReason" :statutes="data"></ripa-stop-reason>{{stopReason}}</div>',
})
