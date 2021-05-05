import RipaFormStep5 from '@/components/organisms/RipaFormStep5'
import { offenseCodes } from '../data/offenseCodes'

export default {
  title: 'Organisms/RipaFormStep5',
  component: RipaFormStep5,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep5 },
  data() {
    return {
      data: offenseCodes.map(item => {
        return {
          ...item,
          fullName: `${item.description} ${item.code}`,
        }
      }),
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step5 v-model="stop" :statutes="data"></ripa-form-step5>{{stop}}</div>',
})
