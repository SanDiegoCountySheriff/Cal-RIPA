import RipaSearch from '@/components/molecules/RipaSearch'

export default {
  title: 'Molecules/RipaSearch',
  component: RipaSearch,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSearch },
  data() {
    return {
      wasSearched: {
        getLabelText: 'no',
      },
    }
  },
  template:
    '<div><ripa-search v-model="wasSearched"></ripa-search>{{getLabelText}}</div>',
})
