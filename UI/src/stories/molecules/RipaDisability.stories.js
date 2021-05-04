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
      stop: {},
    }
  },
  template:
    '<div><ripa-disability v-model="stop"></ripa-disability>{{stop}}</div>',
})
