import RipaStopDate from '@/components/molecules/RipaStopDate'

export default {
  title: 'Molecules/RipaStopDate',
  component: RipaStopDate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopDate },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-stop-date v-model="stop"></ripa-stop-date>{{ stop }}</div>',
})
