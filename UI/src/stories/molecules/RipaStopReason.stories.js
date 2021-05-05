import RipaStopReason from '@/components/molecules/RipaStopReason'
import { formStatutes } from '../data/mappings'

export default {
  title: 'Molecules/RipaStopReason',
  component: RipaStopReason,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopReason },
  data() {
    return {
      statutes: formStatutes(),
      stop: {
        stopReason: {
          reasonForStop: 1,
          trafficViolation: 1,
          trafficViolationCode: 54106,
          reasonForStopExplanation: '',
        },
      },
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-stop-reason v-model="stop" :statutes="statutes"></ripa-stop-reason>{{stop}}</div>',
})
