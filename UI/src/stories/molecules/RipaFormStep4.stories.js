import RipaFormStep4 from '@/components/molecules/RipaFormStep4'

export default {
  title: 'Molecules/RipaFormStep4',
  component: RipaFormStep4,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep4 },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step4 v-model="stop"></ripa-form-step4>{{stop}}</div>',
})
