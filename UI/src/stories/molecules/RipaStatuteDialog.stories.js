import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import { STATUTES } from '@/constants/statutes'

export default {
  title: 'Molecules/RipaStatuteDialog',
  component: RipaStatuteDialog,
  parameters: {},
}

export const statute9992261a2 = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const [statute] = STATUTES.filter(item => item.statuteID === '999.226.1')
      const [level1] = statute.level1.filter(item => item.id === 'a')
      const [level2] = level1.level2.filter(item => item.id === '2')
      console.log(level2)
      return level2
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})
