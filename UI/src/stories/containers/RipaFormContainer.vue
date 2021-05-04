<template>
  <ripa-page-container :admin="admin">
    <ripa-form-template
      :beats="beats"
      :cities="cities"
      :schools="schools"
      :offense-codes="offenseCodes"
    ></ripa-form-template>
  </ripa-page-container>
</template>

<script>
import RipaPageContainer from './RipaPageContainer'
import RipaFormTemplate from '@/components/templates/RipaFormTemplate'
import { beats } from '../data/beats'
import { cities } from '../data/cities'
import { schools } from '../data/schools'
import { offenseCodes } from '../data/offenseCodes'

export default {
  name: 'ripa-form-container',

  components: {
    RipaPageContainer,
    RipaFormTemplate,
  },

  data() {
    return {
      beats: [],
      cities: [],
      schools: [],
      offenseCodes: [],
    }
  },

  methods: {
    getAdminData() {
      this.loading = true
      setTimeout(() => {
        this.schools = schools
          .sort((x, y) => {
            const schoolA = x.name.toUpperCase()
            const schoolB = y.name.toUpperCase()
            return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
          })
          .map(item => {
            return {
              ...item,
              fullName: `${item.name} (${item.district}) ${item.cdsCode}`,
            }
          })
        this.beats = beats
          .sort((x, y) => {
            const beatA = x.command.toUpperCase()
            const beatB = y.command.toUpperCase()
            return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
          })
          .map(item => {
            return {
              ...item,
              fullName: `${item.command} ${item.id}`,
            }
          })
        this.cities = cities.sort((x, y) => {
          const cityA = x.name.toUpperCase()
          const cityB = y.name.toUpperCase()
          return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
        })
        this.offenseCodes = offenseCodes.map(item => {
          return {
            ...item,
            fullName: `${item.description} ${item.code}`,
          }
        })
        this.loading = false
      }, 500)
    },
  },

  created() {
    this.getAdminData()
  },

  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
