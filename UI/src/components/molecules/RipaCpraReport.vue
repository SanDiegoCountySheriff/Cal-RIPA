<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap class="tw-m-0">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            label="From Date"
            class="tw-ml-2"
            @input="fromDateChange"
            :rules="dateRules"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            label="To Date"
            class="tw-ml-2"
            @input="toDateChange"
            :rules="dateRules"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <v-btn
            small
            color="primary"
            class="tw-ml-2"
            @click="createCpraReport(reportDates)"
            :disabled="!isValidDateRange"
            >Create</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
    <v-card :loading="this.loading" class="cpra-report" flat>
      <v-card-title>CPRA Report</v-card-title>
      <v-card-text
        >Only stops accepted by the California DOJ are included on the
        report.</v-card-text
      >
      <v-card-text>
        <div v-for="(item, index) in cpraItems" :key="index">
          <ripa-list :item="item"></ripa-list>
        </div>
      </v-card-text>
      <div class="tw-ml-4 tw-mb-4">
        <v-btn
          @click="downloadReport(reportStats.fileName)"
          v-show="reportHasFilename"
          small
          color="primary"
          >Download Report</v-btn
        >
      </div>
    </v-card>
  </v-container>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaList from '@/components/molecules/RipaList'
import { dateNotInFuture } from '@/utilities/dates'

export default {
  name: 'ripa-cpra-report',

  components: { RipaDatePicker, RipaList },

  data() {
    return {
      fromDate: null,
      toDate: null,
      reportStats: {},
    }
  },

  computed: {
    dateRules() {
      return [
        v => !!v || 'A date is required',
        this.fromDate < this.toDate || 'From date must be before To Date',
        v => dateNotInFuture(v) || 'Date must not be in the future',
      ]
    },

    isValidDateRange() {
      return (
        this.fromDate !== null &&
        this.toDate !== null &&
        this.fromDate < this.toDate &&
        dateNotInFuture(this.fromDate) &&
        dateNotInFuture(this.toDate)
      )
    },

    reportDates() {
      return {
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
    },

    cpraItems() {
      return this.reportStats?.cpraItems?.length > 0
        ? this.reportStats.cpraItems
        : []
    },

    reportHasFilename() {
      return this.reportStats?.fileName !== undefined
    },
  },

  methods: {
    init() {
      this.reportStats = this.items
    },

    fromDateChange(val) {
      this.fromDate = val
    },

    toDateChange(val) {
      this.toDate = val
    },

    createCpraReport(reportDates) {
      const reportParameters = {
        reportDates,
        officerName: `${this.user.firstName} ${this.user.lastName}`,
      }
      this.$emit('handleCreateCpraReport', reportParameters)
    },

    downloadReport(fileName) {
      this.$emit('handleDownloadCpraReport', fileName)
    },
  },

  created() {
    this.init()
  },

  watch: {
    items(val) {
      this.reportStats = val
    },
  },

  props: {
    items: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.cpra-report {
  width: 45%;
  border: 1px solid #ccc !important;
}
</style>
