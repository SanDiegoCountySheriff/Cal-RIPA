import RipaNonForceActionsTaken from '@/components/molecules/RipaNonForceActionsTaken'

export default {
  title: 'Molecules/RipaActionsTaken',
  component: RipaNonForceActionsTaken,
  parameters: {},
}

export const basic = () => ({
  components: { RipaNonForceActionsTaken },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-actions-taken v-model="stop"></ripa-actions-taken>{{stop}}</div>',
})

export const consensualEncounterResultingInSearch = () => ({
  components: { RipaNonForceActionsTaken },
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
