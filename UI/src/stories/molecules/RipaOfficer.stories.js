import RipaOfficer from '@/components/molecules/RipaOfficer'

export default {
  title: 'Molecules/RipaOfficer',
  component: RipaOfficer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaOfficer },
  data() {
    return {
      officer: {},
    }
  },
  template:
    '<div><ripa-officer v-model="officer"></ripa-officer>{{ officer }}</div>',
})
