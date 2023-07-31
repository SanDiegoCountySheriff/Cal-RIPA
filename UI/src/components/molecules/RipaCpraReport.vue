<template>
  <v-container fluid>
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col cols="6" lg="3">
            <ripa-date-picker
              v-model="fromDate"
              :rules="dateRules"
              label="From Date"
            ></ripa-date-picker>
          </v-col>

          <v-col cols="6" lg="3">
            <ripa-date-picker
              v-model="toDate"
              :rules="dateRules"
              label="To Date"
            ></ripa-date-picker>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" lg="3">
            <ripa-switch
              v-model="includeOfficer"
              label="Include Officer Information"
            ></ripa-switch>
          </v-col>

          <v-col cols="6" lg="3">
            <ripa-switch
              v-model="includeBeat"
              label="Include Beat Information"
            ></ripa-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              :disabled="!isValidDateRange"
              @click="createCpraReport"
              color="primary"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="6">
            <v-card :loading="this.loading" outlined>
              <v-card-title>CPRA Report</v-card-title>

              <v-card-text>
                Only stops accepted by the California DOJ are included on the
                report.
              </v-card-text>

              <v-card-text>
                <div v-for="(item, index) in cpraItems" :key="index">
                  <ripa-list :item="item"></ripa-list>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="downloadReport(reportStats.fileName)"
                  v-show="reportHasFilename"
                  text
                  color="primary"
                >
                  Download Report
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaList from '@/components/molecules/RipaList'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { dateNotInFuture } from '@/utilities/dates'

export default {
  name: 'ripa-cpra-report',

  components: { RipaDatePicker, RipaList, RipaSwitch },

  data() {
    return {
      fromDate: null,
      toDate: null,
      reportStats: {},
      includeOfficer: false,
      includeBeat: false,
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

    createCpraReport() {
      const reportParameters = {
        reportDates: { fromDate: this.fromDate, toDate: this.toDate },
        officerName: `${this.user.firstName} ${this.user.lastName}`,
        includeOfficer: this.includeOfficer,
        includeBeat: this.includeBeat,
      }
      this.$emit('handle-create-cpra-report', reportParameters)
    },

    downloadReport(fileName) {
      this.$emit('handle-download-cpra-report', fileName)
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
