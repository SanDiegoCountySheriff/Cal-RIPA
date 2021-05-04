import RipaFormStep4 from '@/components/organisms/RipaFormStep4'

export default {
  title: 'Organisms/RipaFormStep4',
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
