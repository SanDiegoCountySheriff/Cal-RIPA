import RipaFormStep7 from '@/components/molecules/RipaFormStep7'
import { fullStopToApiStop } from '@/utilities/stop'
import { onePersonFullStop, twoPersonFullStop } from '../data/formStop'
import {
  formBeats,
  formCountyCities,
  formNonCountyCities,
  formSchools,
  formStatutes,
} from '../data/mappings'

export default {
  title: 'Molecules/RipaFormStep7',
  component: RipaFormStep7,
  parameters: {},
}

export const onePerson = () => ({
  components: { RipaFormStep7 },
  data() {
    return {
      stop: {},
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
  },
  template:
    '<div><ripa-form-step7 v-model="stop" :apiStop="getApiStop" :on-submit="handleSubmit"></ripa-form-step7>{{stop}}</div>',
  methods: {
    handleSubmit() {
      console.log('handle submit', this.getApiStop)
    },
  },
})

export const twoPerson = () => ({
  components: { RipaFormStep7 },
  data() {
    return {
      stop: {},
    }
  },
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
  },
  template:
    '<div><ripa-form-step7 v-model="stop" :apiStop="getApiStop" :on-submit="handleSubmit"></ripa-form-step7>{{stop}}</div>',
  methods: {
    handleSubmit() {
      console.log('handle submit', this.getApiStop)
    },
  },
})
