import RipaStopReason from '@/components/molecules/RipaOfficer'

export default {
  title: 'Molecules/RipaOfficer',
  component: RipaOfficer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaOfficer },
  data() {
    return {
      officerYears
    }
  },
  template:
    '<ripa-officer v-model="officerYears"></ripa-officer>',
})
