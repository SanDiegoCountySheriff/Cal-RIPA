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
      student: { isStudent: false },
    }
  },
  template:
    '<div><ripa-student v-model="student"></ripa-student>{{student}}</div>',
})
