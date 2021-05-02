import RipaFormStep5 from '@/components/organisms/RipaFormStep5'

export default {
  title: 'Organisms/RipaFormStep5',
  component: RipaFormStep5,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep5 },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step5 v-model="stop"></ripa-form-step5>{{stop}}</div>',
})
