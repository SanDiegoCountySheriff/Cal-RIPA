import RipaStatuteDialog from '@/components/molecules/RipaStatuteDialog'
import { getStatuteContent } from '@/utilities/statutes'

export default {
  title: 'Molecules/RipaStatuteDialog',
  component: RipaStatuteDialog,
  parameters: {},
}

export const statute999226a2 = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const statute = '§999.226(a)(2)'
      const content = getStatuteContent(statute)
      return {
        statute,
        content,
      }
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})

export const statute999226a7 = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const statute = '§999.226(a)(7)'
      const content = getStatuteContent(statute)
      return {
        statute,
        content,
      }
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})

export const statute999224a16 = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const statute = '§999.224(a)(16)'
      const content = getStatuteContent(statute)
      return {
        statute,
        content,
      }
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})

export const statute999226a12B = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const statute = '§999.226(a)(12)(B)'
      const content = getStatuteContent(statute)
      return {
        statute,
        content,
      }
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})

export const statute999226a12D1 = () => ({
  components: { RipaStatuteDialog },
  computed: {
    getStatute() {
      const statute = '§999.226(a)(12)(D)(1)'
      const content = getStatuteContent(statute)
      return {
        statute,
        content,
      }
    },
  },
  template:
    '<ripa-statute-dialog show-dialog :statute="getStatute"></ripa-statute-dialog>',
})
