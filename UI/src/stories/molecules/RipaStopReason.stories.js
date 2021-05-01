import RipaStopReason from '@/components/molecules/RipaStopReason'
import { offenseCodes } from '../data/offenseCodes'

export default {
  title: 'Molecules/RipaStopReason',
  component: RipaStopReason,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopReason },
  data() {
    return {
      data: offenseCodes.map(item => {
        return {
          ...item,
          fullName: `${item.description} ${item.code}`,
        }
      }),
      stop: {
        stopReason: {
          reasonForStop: 1,
          trafficViolation: 1,
          trafficViolationCode: 54106,
          reasonForStopExplanation: 'My name is Steve',
        },
      },
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-stop-reason v-model="stop" :offense-codes="data"></ripa-stop-reason>{{stop}}</div>',
})
