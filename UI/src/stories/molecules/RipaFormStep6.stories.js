import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
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
  title: 'Molecules/RipaFormStep6',
  component: RipaFormStep6,
  parameters: {},
}

export const onePerson = () => ({
  components: { RipaFormStep6 },
  data() {
    return {
      stop: {},
    }
  },
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
    '<div><ripa-form-step6 v-model="stop" :apiStop="getApiStop" :on-submit="handleSubmit"></ripa-form-step6>{{stop}}</div>',
  methods: {
    handleSubmit() {
      console.log('handle submit', this.getApiStop)
    },
  },
})

export const twoPerson = () => ({
  components: { RipaFormStep6 },
  data() {
    return {
      stop: {},
    }
  },
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
    '<div><ripa-form-step6 v-model="stop" :apiStop="getApiStop" :on-submit="handleSubmit"></ripa-form-step6>{{stop}}</div>',
  methods: {
    handleSubmit() {
      console.log('handle submit', this.getApiStop)
    },
  },
})
