import RipaFormStep3 from '@/components/organisms/RipaFormStep3'
import { formStatutes } from '../data/mappings'

export default {
  title: 'Organisms/RipaFormStep3',
  component: RipaFormStep3,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep3 },
  data() {
    return {
      statutes: formStatutes(),
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step3 v-model="stop" :statutes="statutes"></ripa-form-step3>{{stop}}</div>',
})
