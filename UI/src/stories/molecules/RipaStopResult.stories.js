import RipaStopResult from '@/components/molecules/RipaStopResult'
import { formStatutes } from '../data/mappings'

export default {
  title: 'Molecules/RipaStopResult',
  component: RipaStopResult,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopResult },
  data() {
    return {
      statutes: formStatutes(),
      stop: {},
    }
  },
  template:
    '<div><ripa-stop-result v-model="stop" :statutes="statutes"></ripa-stop-result>{{stop}}</div>',
})

export const consensualEncounterResultingInSearch = () => ({
  components: { RipaStopResult },
  data() {
    return {
      statutes: formStatutes(),
      stop: {
        stopReason: {
          reasonForStop: 6,
          trafficViolation: 1,
          trafficViolationCode: 54106,
          reasonableSuspicion: [],
          reasonableSuspicionCode: null,
          searchOfPerson: true,
          searchOfProperty: true,
          reasonForStopExplanation: '',
        },
      },
    }
  },
  template:
    '<div><ripa-stop-result v-model="stop" :statutes="statutes"></ripa-stop-result>{{stop}}</div>',
})
