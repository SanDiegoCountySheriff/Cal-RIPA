import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import { apiStop } from '@/utilities/stop'
import { onePersonFullStop, twoPersonFullStop } from '../data/formStop'
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

export const onePerson = () => ({
  components: { RipaFormSummary },
  computed: {
    getApiStop() {
      return apiStop(
        onePersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :apiStop="getApiStop"></ripa-form-summary></div>',
})

export const twoPerson = () => ({
  components: { RipaFormSummary },
  computed: {
    getApiStop() {
      return apiStop(
        twoPersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :apiStop="getApiStop"></ripa-form-summary></div>',
})
