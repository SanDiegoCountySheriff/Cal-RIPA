<template>
  <v-container class="tw-mt-2">
    <v-data-table :loading="loading" :items="reports" :headers="headers">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" small @click="downloadCpraReport(item.fileName)"
          >Download</v-btn
        >
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'ripa-cpra-report-history',

  data() {
    return {
      reports: [],
      headers: [
        { text: 'From Date', value: 'fromDate' },
        { text: 'To Date', value: 'toDate' },
        { text: 'Officer Name', value: 'officerName' },
        { text: 'Download', value: 'actions', sortable: false },
      ],
    }
  },

  methods: {
    init() {
      this.reports = this.items
    },

    downloadCpraReport(fileName) {
      this.$emit('handleDownloadCpraReport', fileName)
    },
  },

  created() {
    this.init()
  },

  watch: {
    items(val) {
      this.reports = val
    },
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
