import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import { exampleFullStop } from '../data/formStop'

export default {
  title: 'Molecules/RipaFormSummary',
  component: RipaFormSummary,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormSummary },
  data() {
    return {
      stop: exampleFullStop,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :stop="stop"></ripa-form-summary></div>',
})
