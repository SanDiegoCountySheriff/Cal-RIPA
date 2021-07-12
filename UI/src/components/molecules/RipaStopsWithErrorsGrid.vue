<template>
  <div class="ripa-stops-with-errors-grid">
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
      :headers="headers"
      :items="stopsWithErrors"
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
  name: 'ripa-stops-with-errors-grid',

  data() {
    return {
      search: '',
      persons: [],
      headers: [
        { text: 'Stop Date', value: 'stopDate', width: '120' },
        { text: 'Stop Time', value: 'stopTime', width: '120' },
        { text: 'Error Code', value: 'errorCode', width: '120' },
        { text: 'Error Text', value: 'errorText' },
      ],
    }
  },

  methods: {
    init() {
      this.stopsWithErrors = this.items.map(item => {
        return {
          internalId: item.internalId || 'Missing Internal Id',
          stopDate: item.apiStop?.date || 'N/A',
          stopTime: item.apiStop.time || 'N/A',
          errorCode: item.statusCode,
          errorText: item.statusError.message
            ? item.statusError.message
            : item.statusError,
        }
      })
    },

    handleRowClick(item, row) {
      row.select(true)
      if (this.onEditStop) {
        this.onEditStop(item.internalId)
      }
    },
  },

  watch: {
    items(val) {
      this.stopsWithErrors = val
    },
  },

  created() {
    this.init()
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    onEditStop: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-stops-with-errors-grid {
  .v-data-table__wrapper {
    tr:hover {
      cursor: pointer !important;
    }
  }
}
</style>
