import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import {
  fullStopToApiStop,
  apiStopToFullStop,
  fullStopToStop,
} from '@/utilities/stop'
import {
  onePersonFullStop,
  twoPersonFullStop,
  invalidApiStop1,
} from '../data/formStop'
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
  data() {
    return {
      fullStop: onePersonFullStop,
    }
  },
  computed: {
    getApiStop() {
      return fullStopToApiStop(
        onePersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
    getFullStop() {
      return apiStopToFullStop(this.getApiStop)
    },
    getStop() {
      return fullStopToStop(this.getFullStop)
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :apiStop="getApiStop"></ripa-form-summary><div style="margin-top:40px;">{{getApiStop}}</div><div style="margin-top:40px;">{{fullStop}}</div><div style="margin-top:40px;">{{getFullStop}}</div><div style="margin-top:40px;">{{getStop}}</div></div>',
  created() {
    this.$vuetify.theme.dark = true
  },
})

export const twoPerson = () => ({
  components: { RipaFormSummary },
  computed: {
    getApiStop() {
      return fullStopToApiStop(
        twoPersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
    getFullStop() {
      return apiStopToFullStop(this.getApiStop)
    },
    getStop() {
      return fullStopToStop(this.getFullStop)
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :apiStop="getApiStop"></ripa-form-summary><div style="margin-top:40px;">{{getApiStop}}</div><div style="margin-top:40px;">{{fullStop}}</div><div style="margin-top:40px;">{{getFullStop}}</div><div style="margin-top:40px;">{{getStop}}</div></div>',
  created() {
    this.$vuetify.theme.dark = true
  },
})

export const onePersonEdit = () => ({
  components: { RipaFormSummary },
  data() {
    return {
      fullStop: onePersonFullStop,
    }
  },
  computed: {
    getApiStop() {
      return fullStopToApiStop(
        onePersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
    getFullStop() {
      return apiStopToFullStop(this.getApiStop)
    },
    getStop() {
      return fullStopToStop(this.getFullStop)
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary edit-buttons :apiStop="getApiStop"></ripa-form-summary><div style="margin-top:40px;">{{getApiStop}}</div><div style="margin-top:40px;">{{fullStop}}</div><div style="margin-top:40px;">{{getFullStop}}</div><div style="margin-top:40px;">{{getStop}}</div></div>',
  created() {
    this.$vuetify.theme.dark = true
  },
})

export const twoPersonEdit = () => ({
  components: { RipaFormSummary },
  computed: {
    getApiStop() {
      return fullStopToApiStop(
        twoPersonFullStop,
        formBeats(),
        formCountyCities(),
        formNonCountyCities(),
        formSchools(),
        formStatutes(),
      )
    },
    getFullStop() {
      return apiStopToFullStop(this.getApiStop)
    },
    getStop() {
      return fullStopToStop(this.getFullStop)
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary edit-buttons :apiStop="getApiStop"></ripa-form-summary><div style="margin-top:40px;">{{getApiStop}}</div><div style="margin-top:40px;">{{fullStop}}</div><div style="margin-top:40px;">{{getFullStop}}</div><div style="margin-top:40px;">{{getStop}}</div></div>',
  created() {
    this.$vuetify.theme.dark = true
  },
})

export const invalidOnePerson1 = () => ({
  components: { RipaFormSummary },
  data() {
    return {
      fullStop: onePersonFullStop,
    }
  },
  computed: {
    getApiStop() {
      return invalidApiStop1
    },
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-form-summary :apiStop="getApiStop"></ripa-form-summary></div>',
  created() {
    this.$vuetify.theme.dark = true
  },
})
