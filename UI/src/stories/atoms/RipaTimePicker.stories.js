import RipaTimePicker from '@/components/atoms/RipaTimePicker'
import { format } from 'date-fns'

export default {
  title: 'Atoms/RipaTimePicker',
  component: RipaTimePicker,
  parameters: {},
}

export const basic = () => ({
  components: { RipaTimePicker },
  data() {
    return {
      selection: format(new Date(), 'h:mm'),
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-time-picker v-model="selection"></ripa-time-picker>{{selection}}</div>',
})
