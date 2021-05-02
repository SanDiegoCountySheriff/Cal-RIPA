import RipaFormStep6 from '@/components/organisms/RipaFormStep6'

export default {
  title: 'Organisms/RipaFormStep6',
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
