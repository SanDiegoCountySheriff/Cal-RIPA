import RipaFormStep6 from '@/components/molecules/RipaFormStep6'

export default {
  title: 'Molecules/RipaFormStep6',
  component: RipaFormStep6,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep6 },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step6 v-model="stop"></ripa-form-step6>{{stop}}</div>',
})
