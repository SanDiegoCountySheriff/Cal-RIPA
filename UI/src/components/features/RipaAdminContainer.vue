<template>
  <ripa-admin-template
    :loading="loading"
    :beats="beats"
    :cities="cities"
    :schools="schools"
    :statutes="mappedStatutes"
    :on-add-beat="handleAddBeat"
    :on-delete-beat="handleDeleteBeat"
    :on-edit-beat="handleEditBeat"
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
    ...mapState(['beats', 'cities', 'schools']),
    ...mapGetters(['mappedStatutes']),
  },

  methods: {
    ...mapActions([
      'getBeats',
      'getCities',
      'getSchools',
      'getStatutes',
      'addBeat',
      'deleteBeat',
      'editBeat',
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

    async handleAddBeat(beat) {
      this.loading = true
      await Promise.all([this.addBeat(beat)])
      this.loading = false
    },

    async handleDeleteBeat(beat) {
      this.loading = true
      await Promise.all([this.deleteBeat(beat)])
      this.loading = false
    },

    async handleEditBeat(beat) {
      this.loading = true
      await Promise.all([this.editBeat(beat)])
      this.loading = false
    },
  },

  created() {
    this.getAdminData()
  },
}
</script>
