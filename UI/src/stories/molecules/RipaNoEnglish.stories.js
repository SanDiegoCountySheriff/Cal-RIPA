import RipaNoEnglish from '@/components/molecules/RipaNoEnglish'

export default {
  title: 'Molecules/RipaNoEnglish',
  component: RipaNoEnglish,
  parameters: {},
}

export const basic = () => ({
  components: { RipaNoEnglish },
  data() {
    return {
        noEnglish: {},
    }
  },
  template:
    '<div><ripa-no-english v-model="noEnglish"></ripa-no-english>{{noEnglish}}</div>',
})
