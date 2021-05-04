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
      stop: {},
    }
  },
  template: '<div><ripa-race v-model="stop"></ripa-race>{{stop}}</div>',
})
