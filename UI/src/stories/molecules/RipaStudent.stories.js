import RipaStudent from '@/components/molecules/RipaStudent'

export default {
  title: 'Molecules/RipaStudent',
  component: RipaStudent,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStudent },
  data() {
    return {
      stop: {},
    }
  },
  template: '<div><ripa-student v-model="stop"></ripa-student>{{stop}}</div>',
})
