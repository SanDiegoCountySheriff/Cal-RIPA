import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import { formStatutes } from '../data/mappings'

export default {
  title: 'Molecules/RipaFormStep5',
  component: RipaFormStep5,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormStep5 },
  data() {
    return {
      statutes: formStatutes(),
      stop: {},
    }
  },
  template:
    '<div><ripa-form-step5 v-model="stop" :statutes="statutes"></ripa-form-step5>{{stop}}</div>',
})
