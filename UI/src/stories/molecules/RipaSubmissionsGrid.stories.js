import RipaSubmissionsGrid from '@/components/molecules/RipaSubmissionsGrid'
import { submissions } from '../data/submissions'
import { format } from 'date-fns'

export default {
  title: 'Molecules/RipaSubmissionsGrid',
  component: RipaSubmissionsGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSubmissionsGrid },
  data() {
    return {
      data: submissions.map(item => {
        return {
          ...item,
          submissionDateInt: item.submissionDate
            ? new Date(item.submissionDate).getTime()
            : null,
          submissionDateStr: item.submissionDate
            ? format(new Date(item.submissionDate), 'yyyy-MM-dd kk:mm')
            : null,
          stopDateInt: item.stopDate ? new Date(item.stopDate).getTime() : null,
          stopDateStr: item.stopDate
            ? format(new Date(item.stopDate), 'yyyy-MM-dd kk:mm')
            : null,
        }
      }),
    }
  },
  template: '<ripa-submissions-grid :items="data"></ripa-submissions-grid>',
})

export const loading = () => ({
  components: { RipaSubmissionsGrid },
  data() {
    return {
      data: [],
    }
  },
  template:
    '<ripa-submissions-grid loading :items="data"></ripa-submissions-grid>',
})
