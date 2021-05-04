import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import { REASONABLE_SUSPICIONS } from '@/constants/form'

export default {
  title: 'Atoms/RipaCheckGroup',
  component: RipaCheckGroup,
  parameters: {},
}

export const basic = () => ({
  components: { RipaCheckGroup },
  data() {
    return {
      items: REASONABLE_SUSPICIONS,
      selection: [],
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-check-group v-model="selection" :items="items"></ripa-check-group>{{selection}}</div>',
})
