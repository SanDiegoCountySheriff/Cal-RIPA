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
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step3 v-model="stop"></ripa-form-step3>{{stop}}</div>',
})
