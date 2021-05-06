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

export const consensualEncounterResultingInSearch = () => ({
  components: { RipaActionsTaken },
  data() {
    return {
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
    '<div><ripa-actions-taken v-model="stop"></ripa-actions-taken>{{stop}}</div>',
})
