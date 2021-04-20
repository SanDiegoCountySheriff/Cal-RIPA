import RipaRace from '@/components/molecules/RipaRace'

export default {
  title: 'Molecules/RipaRace',
  component: RipaRace,
  parameters: {},
}

export const basic = () => ({
  components: { RipaRace },
  data() {
    return {
        perceivedRace: {},
    }
  },
  template:
    '<div><ripa-race v-model="perceivedRace"></ripa-race>{{perceivedRace}}</div>',
})
