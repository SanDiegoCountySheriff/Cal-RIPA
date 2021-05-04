import RipaAge from '@/components/molecules/RipaAge'

export default {
  title: 'Molecules/RipaAge',
  component: RipaAge,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAge },
  data() {
    return {
      stop: {},
    }
  },
  template: '<div><ripa-age v-model="stop"></ripa-age>{{stop}}</div>',
})
