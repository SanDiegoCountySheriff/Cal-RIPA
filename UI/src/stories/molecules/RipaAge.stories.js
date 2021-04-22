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
      perceivedAge: {},
    }
  },
  template:
    '<div><ripa-age v-model="perceivedAge"></ripa-age>{{perceivedAge}}</div>',
})
