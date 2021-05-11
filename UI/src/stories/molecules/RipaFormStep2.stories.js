import RipaFormStep2 from '@/components/molecules/RipaFormStep2'

export default {
  title: 'Molecules/RipaFormStep2',
  component: RipaFormStep2,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep2 },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step2 v-model="stop"></ripa-form-step2>{{stop}}</div>',
})
