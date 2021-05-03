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
      stop: {},
    }
  },
  template: '<div><ripa-officer v-model="stop"></ripa-officer>{{ stop }}</div>',
})

export const toggle = () => ({
  components: { RipaOfficer },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-officer v-model="stop" toggle></ripa-officer>{{ stop }}</div>',
})
