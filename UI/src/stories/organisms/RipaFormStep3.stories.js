import RipaFormStep3 from '@/components/organisms/RipaFormStep3'

export default {
  title: 'Organisms/RipaFormStep3',
  component: RipaFormStep3,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep3 },
  data() {
    return {
      stopReason: {
        name1: 'spietrek',
        name2: 'lpietrek',
      },
    }
  },
  template:
    '<div><ripa-form-step3 v-model="stopReason"></ripa-form-step3>{{stopReason}}</div>',
})
