<template>
  <div class="ripa-schools-grid">
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
      :items="schools"
      :search="search"
      sort-by="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Schools</v-toolbar-title
          >
        </v-toolbar>
      </template>

      <template v-slot:no-data>
        <div>No Schools Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-schools-grid',

  data() {
    return {
      search: '',
      schools: [],
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'School', value: 'name' },
        { text: 'District', value: 'district' },
        { text: 'County', value: 'county' },
        { text: 'CDS Code', value: 'cdsCode' },
        { text: 'Status', value: 'status' },
      ],
    }
  },

  methods: {
    init() {
      this.schools = this.items
    },
  },

  watch: {
    items(val) {
      this.schools = val
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
