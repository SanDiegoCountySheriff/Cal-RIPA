<template>
  <ripa-admin-template
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="mappedStatutes"
    :on-delete-beat="handleDeleteBeat"
    :on-delete-city="handleDeleteCity"
    :on-delete-school="handleDeleteSchool"
    :on-delete-statute="handleDeleteStatute"
    :on-edit-beat="handleEditBeat"
    :on-edit-city="handleEditCity"
    :on-edit-school="handleEditSchool"
    :on-edit-statute="handleEditStatute"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaAdminTemplate,
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState(['beats', 'cities', 'schools', 'isAdmin']),
    ...mapGetters(['mappedStatutes']),
  },

  methods: {
    ...mapActions([
      'deleteBeat',
      'deleteCity',
      'deleteSchool',
      'deleteStatute',
      'editBeat',
      'editCity',
      'editSchool',
      'editStatute',
      'getBeats',
      'getCities',
      'getSchools',
      'getStatutes',
    ]),

    async getAdminData() {
      this.loading = true
      await Promise.all([
        this.getBeats(),
        this.getCities(),
        this.getSchools(),
        this.getStatutes(),
      ])
      this.loading = false
    },

    async handleDeleteBeat(beat) {
      this.loading = true
      await Promise.all([this.deleteBeat(beat)])
      this.loading = false
    },

    async handleDeleteCity(city) {
      this.loading = true
      await Promise.all([this.deleteCity(city)])
      this.loading = false
    },

    async handleDeleteSchool(school) {
      this.loading = true
      await Promise.all([this.deleteSchool(school)])
      this.loading = false
    },

    async handleDeleteStatute(statute) {
      this.loading = true
      await Promise.all([this.deleteStatute(statute)])
      this.loading = false
    },

    async handleEditBeat(beat) {
      this.loading = true
      await Promise.all([this.editBeat(beat)])
      this.loading = false
    },

    async handleEditCity(city) {
      this.loading = true
      await Promise.all([this.editCity(city)])
      this.loading = false
    },

    async handleEditSchool(school) {
      this.loading = true
      await Promise.all([this.editSchool(school)])
      this.loading = false
    },

    async handleEditStatute(statute) {
      this.loading = true
      await Promise.all([this.editStatute(statute)])
      this.loading = false
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
