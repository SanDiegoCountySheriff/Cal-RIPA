import RipaDisability from '@/components/molecules/RipaDisability'

export default {
  title: 'Molecules/RipaDisability',
  component: RipaDisability,
  parameters: {},
}

export const basic = () => ({
  components: { RipaDisability },
  data() {
    return {
      stopReason: {},
    }
  },
  template:
    '<div><ripa-disability v-model="stopReason"></ripa-disability>{{stopReason}}</div>',
})
