<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab>Beats</v-tab>
      <v-tab>Cities</v-tab>
      <v-tab>Schools</v-tab>
      <v-tab>Statutes</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <ripa-beats-grid :loading="loading" :items="beats"></ripa-beats-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-cities-grid :loading="loading" :items="cities"></ripa-cities-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-schools-grid
          :loading="loading"
          :items="schools"
        ></ripa-schools-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-statutes-grid
          :loading="loading"
          :items="statutes"
        ></ripa-statutes-grid>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import RipaBeatsGrid from '@/components/molecules/RipaBeatsGrid'
import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid'
import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid'

export default {
  name: 'ripa-admin-wrapper',

  components: {
    RipaBeatsGrid,
    RipaCitiesGrid,
    RipaSchoolsGrid,
    RipaStatutesGrid,
  },

  data() {
    return {
      tab: 0,
    }
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    beats: {
      type: Array,
      default: () => [],
    },
    cities: {
      type: Array,
      default: () => [],
    },
    schools: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
