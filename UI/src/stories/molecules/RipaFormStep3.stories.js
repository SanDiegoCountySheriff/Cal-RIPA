import RipaFormStep3 from '@/components/molecules/RipaFormStep3'
import { formStatutes } from '../data/mappings'

export default {
  title: 'Molecules/RipaFormStep3',
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
