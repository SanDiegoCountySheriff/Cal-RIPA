import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import { apiStop } from '@/utilities/stop'
import { exampleFullStop } from '../data/formStop'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  title: 'Molecules/RipaFormSummary',
  component: RipaFormSummary,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormSummary },
  computed: {
    getFullStop() {
      return apiStop(
        exampleFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :fullStop="getFullStop"></ripa-form-summary></div>',
})
