<template>
  <ripa-admin-template
    :loading="loading"
    :beats="mappedAdminBeats"
    :cities="mappedAdminCities"
    :schools="mappedAdminSchools"
    :statutes="mappedAdminStatutes"
    :stops="mappedAdminStops"
    :submissions="mappedAdminSubmissions"
    :users="mappedAdminUsers"
    :on-delete-beat="handleDeleteBeat"
    :on-delete-city="handleDeleteCity"
    :on-delete-school="handleDeleteSchool"
    :on-delete-statute="handleDeleteStatute"
    :on-edit-beat="handleEditBeat"
    :on-edit-city="handleEditCity"
    :on-edit-school="handleEditSchool"
    :on-edit-statute="handleEditStatute"
    :on-edit-user="handleEditUser"
  ></ripa-admin-template>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import { mapGetters, mapActions } from 'vuex'

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
    ...mapGetters([
      'mappedAdminBeats',
      'mappedAdminCities',
      'mappedAdminSchools',
      'mappedAdminStatutes',
      'mappedAdminStops',
      'mappedAdminSubmissions',
      'mappedAdminUsers',
    ]),
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
      'editUser',
      'getAdminBeats',
      'getAdminCities',
      'getAdminSchools',
      'getAdminStatutes',
      'getAdminUsers',
    ]),

    async getAdminData(beat) {
      this.loading = true
      await Promise.all([
        this.getAdminBeats(),
        this.getAdminCities(),
        this.getAdminSchools(),
        this.getAdminStatutes(),
        this.getAdminUsers(),
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

    async handleEditUser(user) {
      this.loading = true
      await Promise.all([this.editUser(user)])
      this.loading = false
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
