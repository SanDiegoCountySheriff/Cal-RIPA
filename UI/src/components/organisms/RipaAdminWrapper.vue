<template>
  <v-card>
    <v-tabs v-model="tab" show-arrows>
      <v-tab>Beats</v-tab>
      <v-tab>Cities</v-tab>
      <v-tab>Schools</v-tab>
      <v-tab>Statutes</v-tab>
      <v-tab>Stops</v-tab>
      <v-tab>Submissions</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <ripa-beats-grid
          :loading="loading"
          :items="beats"
          :on-delete-beat="onDeleteBeat"
          :on-edit-beat="onEditBeat"
        ></ripa-beats-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-cities-grid
          :loading="loading"
          :items="cities"
          :on-delete-city="onDeleteCity"
          :on-edit-city="onEditCity"
        ></ripa-cities-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-schools-grid
          :loading="loading"
          :items="schools"
          :on-delete-school="onDeleteSchool"
          :on-edit-school="onEditSchool"
        ></ripa-schools-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-statutes-grid
          :loading="loading"
          :items="statutes"
          :on-delete-statute="onDeleteStatute"
          :on-edit-statute="onEditStatute"
        ></ripa-statutes-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-stops-grid :loading="loading" :items="stops"></ripa-stops-grid>
      </v-tab-item>
      <v-tab-item>
        <ripa-submissions-grid
          :loading="loading"
          :items="submissions"
        ></ripa-submissions-grid>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import RipaBeatsGrid from '@/components/molecules/RipaBeatsGrid'
import RipaCitiesGrid from '@/components/molecules/RipaCitiesGrid'
import RipaSchoolsGrid from '@/components/molecules/RipaSchoolsGrid'
import RipaStatutesGrid from '@/components/molecules/RipaStatutesGrid'
import RipaStopsGrid from '@/components/molecules/RipaStopsGrid'
import RipaSubmissionsGrid from '@/components/molecules/RipaSubmissionsGrid'

export default {
  name: 'ripa-admin-wrapper',

  components: {
    RipaBeatsGrid,
    RipaCitiesGrid,
    RipaSchoolsGrid,
    RipaStatutesGrid,
    RipaStopsGrid,
    RipaSubmissionsGrid,
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
    stops: {
      type: Array,
      default: () => [],
    },
    submissions: {
      type: Array,
      default: () => [],
    },
    onDeleteBeat: {
      type: Function,
      default: () => {},
    },
    onDeleteCity: {
      type: Function,
      default: () => {},
    },
    onDeleteSchool: {
      type: Function,
      default: () => {},
    },
    onDeleteStatute: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
    onEditCity: {
      type: Function,
      default: () => {},
    },
    onEditSchool: {
      type: Function,
      default: () => {},
    },
    onEditStatute: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
