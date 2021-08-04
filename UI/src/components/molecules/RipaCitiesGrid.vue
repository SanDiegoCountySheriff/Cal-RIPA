<template>
  <div class="ripa-cities-grid">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="cities"
      :search="search"
      sort-by="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Cities</v-toolbar-title
          >
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <div>No City Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { STATES } from '@/constants/states'

export default {
  name: 'ripa-cities-grid',

  data() {
    return {
      search: '',
      cities: [],
      mappedCounties: [],
      mappedStates: [],
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'City', value: 'name' },
        { text: 'County', value: 'county' },
        { text: 'State', value: 'state' },
        { text: 'Deactivation Date', value: 'deactivationDate' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          width: '80',
          align: 'center',
        },
      ],
    }
  },

  methods: {
    init() {
      this.cities = this.items
      this.mappedStates = STATES.map(item => item.abbreviation)
      this.mappedCounties = this.items
        .map(item => item.county.toUpperCase())
        .sort()
    },
  },

  watch: {
    items(val) {
      this.cities = val
    },
  },

  created() {
    this.init()
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
