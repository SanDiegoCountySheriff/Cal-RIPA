<template>
  <div class="ripa-cities-grid">
    <p class="ripa-cities-grid--info">
      Data in this table is provided by CA DOJ and maintained periodically on
      CLEW (<a
        href="https://clew.doj.ca.gov/sd-ab953"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://clew.doj.ca.gov/sd-ab953 </a
      >). Exercise caution when uploading data. Any mismatches will produce
      errors upon submission to CA DOJ.
    </p>
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
export default {
  name: 'ripa-cities-grid',

  data() {
    return {
      search: '',
      cities: [],
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'City', value: 'name' },
        { text: 'County', value: 'county' },
        { text: 'State', value: 'state' },
        { text: 'Deactivation Date', value: 'deactivationDate' },
      ],
    }
  },

  methods: {
    init() {
      this.cities = this.items
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

<style lang="scss">
.ripa-cities-grid {
  .ripa-cities-grid--info {
    margin: 16px 16px 0 16px;
    color: red;
  }
}
</style>
