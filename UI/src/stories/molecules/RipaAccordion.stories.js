import RipaAccordion from '@/components/molecules/RipaAccordion'
import { stops } from '../data/stops'

export default {
  title: 'Molecules/RipaAccordion',
  component: RipaAccordion,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAccordion },
  data() {
    return {
      items: stops,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-accordion :items="items"></ripa-accordion></div>',
})
