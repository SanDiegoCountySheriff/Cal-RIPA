<template>
  <div class="ripa-person-grid">
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
      :items="persons"
      :search="search"
      @click:row="handleRowClick"
      sort-by="id"
      single-select
    >
      <template v-slot:no-data>
        <div>No Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-stop-errors-grid',

  data() {
    return {
      search: '',
      persons: [],
      headers: [
        { text: 'ID', value: 'id', width: '70' },
        { text: 'Student', value: 'isStudent', width: '100' },
        { text: 'Race', value: 'perceivedRace', width: '150' },
        { text: 'Gender', value: 'perceivedGender', width: '150' },
        { text: 'Gender Nonconforming', value: 'genderNonconforming' },
        { text: 'LGBT', value: 'perceivedLgbt' },
        { text: 'Age', value: 'perceivedAge' },
        { text: 'Limited English', value: 'perceivedLimitedEnglish' },
        { text: 'Disabilities', value: 'anyDisabilities' },
      ],
    }
  },

  methods: {
    init() {
      this.persons = this.items
    },

    handleRowClick(item, row) {
      row.select(true)
      if (this.onOpenPerson) {
        this.onOpenPerson(item.id)
      }
    },
  },

  watch: {
    items(val) {
      this.persons = val
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
    onOpenPerson: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-person-grid {
  .v-data-table__wrapper {
    tr:hover {
      cursor: pointer !important;
    }
  }
}
</style>
