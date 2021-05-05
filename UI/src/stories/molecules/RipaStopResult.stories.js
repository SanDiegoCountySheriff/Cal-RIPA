import RipaStopResult from '@/components/molecules/RipaStopResult'
import { offenseCodes } from '../data/offenseCodes'

export default {
  title: 'Molecules/RipaStopResult',
  component: RipaStopResult,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopResult },
  data() {
    return {
      data: offenseCodes.map(item => {
        return {
          ...item,
          fullName: `${item.description} ${item.code}`,
        }
      }),
      stop: {},
    }
  },
  template:
    '<div><ripa-stop-result v-model="stop" :statutes="data"></ripa-stop-result>{{stop}}</div>',
})

export const consensualEncounterResultingInSearch = () => ({
  components: { RipaStopResult },
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
          reasonForStop: 6,
          trafficViolation: 1,
          trafficViolationCode: 54106,
          reasonSuspicion: [],
          reasonSuspicionCode: null,
          searchOfPerson: true,
          searchOfProperty: true,
          reasonForStopExplanation: '',
        },
      },
    }
  },
  template:
    '<div><ripa-stop-result v-model="stop" :statutes="data"></ripa-stop-result>{{stop}}</div>',
})
