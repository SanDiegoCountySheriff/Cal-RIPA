import RipaButtonGroup from '@/components/atoms/RipaButtonGroup'
import { GENDERS } from '@/constants/form'

export default {
  title: 'Atoms/RipaButtonGroup',
  component: RipaButtonGroup,
  parameters: {},
}

export const basic = () => ({
  components: { RipaButtonGroup },
  data() {
    return {
      items: GENDERS,
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-button-group v-model="selection" :items="items"></ripa-button-group>{{selection}}</div>',
})
