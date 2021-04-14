import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import { format } from 'date-fns'

export default {
  title: 'Atoms/RipaDatePicker',
  component: RipaDatePicker,
  parameters: {},
}

export const basic = () => ({
  components: { RipaDatePicker },
  data() {
    return {
      selection: format(new Date(), 'yyyy-MM-dd'),
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-date-picker v-model="selection"></ripa-date-picker>{{selection}}</div>',
})
