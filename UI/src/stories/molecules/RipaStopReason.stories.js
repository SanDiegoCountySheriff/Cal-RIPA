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
        explanation: 'My name is Steve',
      },
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-stop-reason v-model="stopReason" :statutes="data"></ripa-stop-reason>{{stopReason}}</div>',
})
