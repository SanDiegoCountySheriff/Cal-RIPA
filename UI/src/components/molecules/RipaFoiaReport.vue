<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap class="tw-m-0">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            class="tw-ml-2"
            label="From Date"
            @input="fromDateChange"
            :rules="dateRules"
          ></ripa-date-picker>
        </div>
      </v-flex>
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            class="tw-ml-2"
            label="To Date"
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
            @click="createFoiaReport(reportDates)"
            :disabled="!isValidDateRange"
            >Create</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
    <v-card
      :loading="this.loading"
      class="foia-report mx-2 my-2 float-left"
      flat
    >
      <v-card-title>FOIA Report</v-card-title>
      <v-card-text>
        <div v-for="(item, index) in foiaReportStats.cpraItems" :key="index">
          <ripa-list :item="item"></ripa-list>
        </div>
      </v-card-text>
      <div class="tw-ml-4 tw-mb-4">
        <v-btn
          @click="downloadReport"
          v-show="foiaReportStats.fileName"
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

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ripa-foia-report',

  components: { RipaDatePicker, RipaList },

  data() {
    return {
      fromDate: null,
      toDate: null,
    }
  },

  computed: {
    ...mapGetters(['foiaReportStats']),

    dateRules() {
      return [
        v => !!v || 'A date is required',
        this.fromDate < this.toDate || 'From date must be before To Date',
      ]
    },

    isValidDateRange() {
      return (
        this.fromDate !== null &&
        this.toDate !== null &&
        this.fromDate < this.toDate
      )
    },

    reportDates() {
      return {
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
    },
  },

  methods: {
    // TODO: move to top-level component
    ...mapActions(['resetFoiaReportStats']),

    fromDateChange(val) {
      this.fromDate = val
    },

    toDateChange(val) {
      this.toDate = val
    },

    createFoiaReport(reportDates) {
      this.$emit('handleCreateFoiaReport', reportDates)
    },

    downloadReport() {
      // TODO: emit event with filename to download file
      alert(this.foiaReportStats.fileName)
    },
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  destroyed() {
    // TODO: emit event to reset stats
    this.resetFoiaReportStats()
  },
}
</script>

<style lang="scss" scoped>
.foia-report {
  width: 45%;
  border: 1px solid #ccc !important;
}
</style>
