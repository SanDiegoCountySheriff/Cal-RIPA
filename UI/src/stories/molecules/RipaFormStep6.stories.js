import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
import { agencyQuestions } from '../data/mappings'

export default {
  title: 'Molecules/RipaFormStep6',
  component: RipaFormStep6,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep6 },
  data() {
    return {
      questions: agencyQuestions(),
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step6 v-model="stop" :questions="questions"></ripa-form-step6>{{stop}}</div>',
})
