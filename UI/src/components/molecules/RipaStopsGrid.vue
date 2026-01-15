<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center wrap class="stopsGridContainer">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopFromDate"
            label="From Date"
            @input="fromDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopToDate"
            label="To Date"
            @input="toDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <v-select
            v-model="currentStatusFilter"
            :items="statuses"
            label="Status"
            multiple
            deletable-chips
            small-chips
            clearable
            @change="statusChange"
          ></v-select>
        </div>
      </v-flex>

      <v-flex xs12 md1>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isPiiFound"
            class="tw-ml-2"
            label="PII Found"
            @change="piiChange"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md1>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isEdited"
            class="tw-ml-2"
            label="Edited"
            @change="isEditedChange"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md1>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isLateSubmission"
            class="tw-ml-2"
            label="Late"
            @change="lateSubmissionChange"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-autocomplete
            v-model="selectedErrorCodes"
            :items="getErrorCodeSearchItems"
            :loading="errorCodesLoading"
            cache-items
            multiple
            label="Error Codes"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                small
                @click:close="removeErrorCode(data.item)"
              >
                {{ data.item.value }}
              </v-chip>
            </template>
          </v-autocomplete>
        </div>
      </v-flex>

      <v-flex xs12>
        <div v-if="stops.summary" class="stopsSummary">
          <p>
            <span class="label">Total</span>
            <span class="count">{{ stops.summary.total }}</span>
          </p>
          <p>
            <span class="label">Unsubmitted</span>
            <span class="count">{{ stops.summary.unsubmitted }}</span>
          </p>
          <p>
            <span class="label">Submitted</span>
            <span class="count">{{ stops.summary.submitted }}</span>
          </p>
          <p>
            <span class="label">Resubmitted</span>
            <span class="count">{{ stops.summary.resubmitted }}</span>
          </p>
          <p>
            <span class="label">Pending</span>
            <span class="count">{{ stops.summary.pending }}</span>
          </p>
          <p>
            <span class="label">Errors</span>
            <span class="count">{{ stops.summary.failed }}</span>
          </p>
        </div>
        <v-alert
          v-if="maxBackdateDays > 0"
          type="info"
          dense
          text
          border="left"
          class="tw-mt-2 tw-mb-2"
        >
          <span class="tw-text-sm">
            Backdate configuration is set to
            <strong>
              {{ maxBackdateDays }} day{{ maxBackdateDays === 1 ? '' : 's' }}.
            </strong>
            Stops must be at least
            <strong>
              {{ cooldownDays }} day{{ cooldownDays === 1 ? '' : 's' }}
            </strong>
            old before submission.
          </span>
        </v-alert>

        <v-progress-linear v-if="loading" indeterminate color="cyan">
        </v-progress-linear>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          v-model="selectedItems"
          class="adminStopsTable"
          :loading="loading"
          :headers="headers"
          :single-select="false"
          :hide-default-footer="true"
          show-select
          :items="getStops"
          :server-items-length="getTotalStops"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :search="search"
        >
          <template v-slot:header.data-table-select>
            <v-simple-checkbox
              :indeterminate="someSelectableSelected"
              :value="allSelectableSelected"
              @input="toggleSelectAll"
            >
            </v-simple-checkbox>
          </template>
          <template
            v-slot:item.data-table-select="{ item, isSelected, select }"
          >
            <v-checkbox
              :disabled="isStopInCooldown(item.stopDateTime)"
              :input-value="isSelected"
              @change="select($event)"
            ></v-checkbox>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="tw-uppercase"
                >Admin: Stops</v-toolbar-title
              >
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    @click="handleSubmitAll"
                    color="primary"
                    class="ml-5"
                  >
                    Submit All Stops to DOJ
                  </v-btn>
                </template>

                <span>
                  Submit all the stops to the DOJ. Stops with PII or that are in
                  an error state will not be resubmitted.
                </span>
              </v-tooltip>

              <ripa-switch
                v-model="showingVersionTwoStops"
                label="Show V2 Stops"
                color="primary"
                class="ml-8"
              ></ripa-switch>

              <v-spacer></v-spacer>

              <v-btn
                @click="handleSubmitSelected"
                color="primary"
                v-if="selectedItems.length > 0"
              >
                Submit Selected Stops to DOJ ({{ selectedItems.length }})
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip
              top
              v-if="statuses.find(s => s.value === item.status).isEditable"
              content-class="custom-tooltip"
              open-delay="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="tw-mr-2"
                  @click="editItem(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip
              top
              v-else
              content-class="custom-tooltip"
              open-delay="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="tw-mr-2"
                  @click="viewItem(item)"
                  v-bind="attrs"
                  v-on="on"
                  >mdi-eye</v-icon
                >
              </template>
              <span>View</span>
            </v-tooltip>
          </template>

          <template v-slot:footer>
            <div v-if="items.stops" class="paginationWrapper">
              <p>
                Items {{ calculateItemsFrom }} - {{ calculateItemsTo }} of
                {{ items.summary.total }}
              </p>
              <v-pagination
                v-model="currentPage"
                :length="getPaginationLength"
                @next="handleNextPage"
                @input="handleJumpToPage"
                :total-visible="20"
                @previous="handlePreviousPage"
              ></v-pagination>
              <v-combobox
                outlined
                dense
                v-model="itemsPerPage"
                :items="itemsPerPageOptions"
                label="Items per page"
                @input="handleFilter"
                class="itemsPerPageSelector"
              ></v-combobox>
            </div>
          </template>
          <template v-slot:no-data>
            <div>No Data</div>
          </template>
          <template v-slot:item.isEdited="{ item }">
            {{ item.isEdited ? 'Yes' : 'No' }}
          </template>
          <template v-slot:item.isPiiFound="{ item }">
            {{ item.isPiiFound ? 'Yes' : 'No' }}
          </template>
          <template v-slot:item.stopDateTime="{ item }">
            <span>{{ item.stopDateTime }}</span>
            <v-icon
              v-if="item.lateSubmissionExplanation"
              title="Late Submission"
              class="late-submission-icon"
              color="warning"
              small
            >
              mdi-clock-alert
            </v-icon>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { SUBMISSION_STATUSES } from '../../constants/stop'
import RipaEditStopMixin from '../mixins/RipaEditStopMixin'
import _ from 'lodash'
import { isAfter, getYear } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export default {
  name: 'ripa-stops-grid',

  components: {
    RipaDatePicker,
    RipaSwitch,
  },

  mixins: [RipaEditStopMixin],

  data() {
    return {
      search: '',
      errorCodesLoading: false,
      stops: [],
      headers: [
        { text: 'ID', value: 'id', sortName: 'id' },
        { text: 'Stop Date', value: 'stopDateTime', sortName: 'StopDateTime' },
        { text: 'Status', value: 'status', sortName: 'Status' },
        { text: 'Edited', value: 'isEdited', sortName: 'IsEdited' },
        { text: 'PII Found', value: 'isPiiFound', sortName: 'IsPiiFound' },
        { text: 'Officer Name', value: 'officerName', sortName: 'OfficerName' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      isPiiFound: this.savedFilters?.filters.isPiiFound
        ? this.savedFilters?.filters.isPiiFound
        : null,
      isEdited: this.savedFilters?.filters.isEdited
        ? this.savedFilters?.filters.isEdited
        : null,
      isLateSubmission: this.savedFilters?.filters.isLateSubmission
        ? this.savedFilters?.filters.isLateSubmission
        : null,
      errorsFound: this.savedFilters?.filters.isEdited
        ? this.savedFilters?.filters.isEdited
        : null,
      officerName: null,
      selectedItems: [],
      selectedErrorCodes: this.savedFilters?.filters.errorCodes
        ? this.savedFilters?.filters.errorCodes
        : [],
      stopFromDate: this.savedFilters?.filters.stopFromDate
        ? this.savedFilters?.filters.stopFromDate
        : null,
      stopToDate: this.savedFilters?.filters.stopToDate
        ? this.savedFilters?.filters.stopToDate
        : null,
      currentStatusFilter: this.savedFilters?.filters.status
        ? this.savedFilters?.filters.status
        : null,
      statuses: SUBMISSION_STATUSES,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250, 500, 1000],
      itemsPerPage: this.savedFilters?.filters.itemsPerPage
        ? this.savedFilters?.filters.itemsPerPage
        : 10,
      currentOffset: this.currentPage * this.itemsPerPage,
      sortBy: 'StopDateTime',
      sortDesc: true,
      version: this.savedFilters?.version ?? 1,
      showingVersionTwoStops: this.savedFilters?.version === 2 || false,
    }
  },

  computed: {
    maxBackdateDays() {
      const configValue = this.$store?.state?.apiConfig?.MaxBackdateDays
      if (configValue === undefined || configValue === null) {
        return 0
      }
      const days = parseInt(configValue, 10)
      return isNaN(days) ? 0 : days
    },
    cooldownDays() {
      return this.maxBackdateDays > 0 ? this.maxBackdateDays + 1 : 0
    },
    cooldownDate() {
      if (this.maxBackdateDays === 0) {
        return null
      }

      const now = new Date()
      const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      cutoff.setDate(cutoff.getDate() - this.cooldownDays)
      return cutoff
    },
    selectableStops() {
      return this.getStops.filter(
        stop => !this.isStopInCooldown(stop.stopDateTime),
      )
    },
    allSelectableSelected() {
      if (!this.selectableStops.length) {
        return false
      }

      const selectedIds = new Set(this.selectedItems.map(stop => stop.id))
      return this.selectableStops.every(stop => selectedIds.has(stop.id))
    },
    someSelectableSelected() {
      if (!this.selectableStops.length) {
        return false
      }

      const selectedIds = new Set(this.selectedItems.map(stop => stop.id))
      const selectedCount = this.selectableStops.filter(stop =>
        selectedIds.has(stop.id),
      ).length
      return selectedCount > 0 && selectedCount < this.selectableStops.length
    },
    getStops() {
      if (this.items.stops) {
        return this.items.stops
      } else {
        return []
      }
    },
    getTotalStops() {
      if (this.items.stops) {
        return this.items.stops.length
      } else {
        return 0
      }
    },
    getErrorCodeSearchItems() {
      return this.errorCodeSearch.items.map(itemObj => {
        return {
          text: `${itemObj.code}: ${itemObj.message.substr(0, 100)}...`,
          value: itemObj.code,
        }
      })
    },
    getPaginationLength() {
      if (this.items.stops) {
        return Math.ceil(this.stops.summary.total / this.itemsPerPage)
      } else {
        return 0
      }
    },
    calculateItemsTo() {
      if (this.stops.summary.total === 0) {
        return 0
      } else if (this.currentPage === this.getPaginationLength) {
        return this.stops.summary.total
      } else {
        return this.currentPage * this.itemsPerPage
      }
    },
    calculateItemsFrom() {
      if (this.stops.summary.total === 0) {
        return 0
      } else if (this.currentPage === 1) {
        return this.currentPage
      } else {
        return (this.currentPage - 1) * this.itemsPerPage + 1
      }
    },
    getFilterStatus() {
      let sortOrder = this.sortDesc
      if (Array.isArray(this.sortDesc)) {
        sortOrder = this.sortDesc[0]
      }
      return {
        isPiiFound: this.isPiiFound,
        isEdited: this.isEdited,
        isLateSubmission: this.isLateSubmission,
        stopFromDate: this.stopFromDate,
        stopToDate: this.stopToDate,
        status: this.currentStatusFilter,
        errorCodes: this.selectedErrorCodes,
        orderBy: this.getColumnSortName(),
        order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
      }
    },
  },

  methods: {
    toggleSelectAll(checked) {
      if (checked) {
        this.selectedItems = this.selectableStops
      } else {
        this.selectedItems = []
      }
    },
    isStopInCooldown(stopDateTime) {
      if (this.maxBackdateDays === 0 || !this.cooldownDate) {
        return false
      }

      const stopDate = new Date(stopDateTime)
      const stopDateAtMidnight = new Date(
        stopDate.getFullYear(),
        stopDate.getMonth(),
        stopDate.getDate(),
      )
      return stopDateAtMidnight > this.cooldownDate
    },
    getCooldownStopsInfo(stops) {
      if (this.maxBackdateDays === 0) {
        return { cooldownStops: [], cooldownStopIds: [], allInCooldown: false }
      }
      const cooldownStops = stops.filter(stop =>
        this.isStopInCooldown(stop.stopDateTime),
      )
      const cooldownStopIds = cooldownStops.map(stop => stop.id)
      return {
        cooldownStops,
        cooldownStopIds,
        allInCooldown:
          cooldownStops.length === stops.length && stops.length > 0,
      }
    },
    init() {
      this.stops = this.items
      // if the user has a from date saved in session storage
      // this overrides any date checking
      if (this.savedFilters?.filters.stopFromDate) {
        this.stopFromDate = this.savedFilters?.filters.stopFromDate
      } else {
        const currentDateInUTC = zonedTimeToUtc(new Date())
        const currentYear = getYear(new Date())
        const deadlineDateInUTC = zonedTimeToUtc(
          new Date(`${currentYear}-04-01T00:00:00`),
        )
        // if the current date is after the April 1st deadline, set the start date
        // filter to Jan 1 of current year
        const isDateAfterDeadline = isAfter(currentDateInUTC, deadlineDateInUTC)
        if (isDateAfterDeadline) {
          this.stopFromDate = `${currentYear}-01-01`
          this.handleFilter()
        }
      }
      if (!_.isEmpty(this.savedFilters?.filters)) {
        this.handleFilter()
      }
      if (this.getErrorCodeSearchItems.length === 0) {
        this.callErrorCodeSearch('')
      }
    },
    handleNextPage() {
      // the pagination component updates the current page
      // BEFORE these are called but this math is based on the
      // current value. So need to subtract 1
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
        version: this.version,
      })
    },
    handlePreviousPage() {
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
        version: this.version,
      })
    },
    handleJumpToPage() {
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
        version: this.version,
      })
    },
    editItem(item) {
      this.handleEditStopByAdmin(item, window.location.pathname)
    },
    viewItem(item) {
      this.handleViewStopByAdmin(item, window.location.pathname)
    },
    callErrorCodeSearch: _.debounce(function (val) {
      this.errorCodesLoading = true
      this.$emit('callErrorCodeSearch', val)
    }, 400),
    removeErrorCode(val) {
      this.selectedErrorCodes = this.selectedErrorCodes.filter(errorCode => {
        return errorCode !== val.value
      })
    },
    fromDateChange(val) {
      this.stopFromDate = val
      this.handleFilter()
    },
    toDateChange(val) {
      this.stopToDate = val
      this.handleFilter()
    },
    statusChange(val) {
      this.currentStatusFilter = val
      this.handleFilter()
    },
    piiChange(val) {
      if (!val) {
        this.isPiiFound = null
      } else {
        this.isPiiFound = true
      }
      this.handleFilter()
    },
    isEditedChange(val) {
      if (!val) {
        this.isEdited = null
      } else {
        this.isEdited = true
      }
      this.handleFilter()
    },
    lateSubmissionChange(val) {
      if (!val) {
        this.isLateSubmission = null
      } else {
        this.isLateSubmission = true
      }
      this.handleFilter()
    },
    handleFilter() {
      // whenever you change a filter, you're going to
      // reset the paging because it would all change with new settings
      let sortOrder = this.sortDesc
      if (Array.isArray(this.sortDesc)) {
        sortOrder = this.sortDesc[0]
      }
      // reset any selections
      this.selectedItems = []
      const filterData = {
        limit: this.itemsPerPage,
        filters: {
          stopFromDate: this.stopFromDate,
          stopToDate: this.stopToDate,
          status: this.currentStatusFilter,
          isPiiFound: this.isPiiFound,
          isEdited: this.isEdited,
          isLateSubmission: this.isLateSubmission,
          // need to make a comma delimited string out of the error codes
          errorCodes: this.selectedErrorCodes,
          orderBy:
            // if the column sort name is null, default to sorting by the stop date
            this.getColumnSortName() === null
              ? 'StopDateTime'
              : this.getColumnSortName(),
          order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
        },
        version: this.version,
      }
      this.$emit('handleAdminStopsFiltering', filterData)
      if (!this.savedFilters?.offset) {
        this.currentPage = 1
      } else {
        this.currentPage = this.savedFilters?.offset / this.itemsPerPage + 1
      }
    },
    handleSubmitAll() {
      const filterData = {
        stopFromDate: this.stopFromDate,
        stopToDate: this.stopToDate,
        status: this.currentStatusFilter,
        isPiiFound: this.isPiiFound,
        isEdited: this.isEdited,
        isLateSubmission: this.isLateSubmission,
        // need to make a comma delimited string out of the error codes
        errorCodes: this.selectedErrorCodes.join(),
      }

      const cooldownInfo = this.getCooldownStopsInfo(this.getStops)

      this.$emit('handleSubmitAll', {
        ...filterData,
        cooldownStopIds: cooldownInfo.cooldownStopIds,
        allInCooldown: cooldownInfo.allInCooldown,
        maxBackdateDays: this.maxBackdateDays,
        cooldownDays: this.cooldownDays,
      })
    },
    handleSubmitSelected() {
      const itemIds = this.selectedItems.map(itemObj => {
        return itemObj.id
      })

      const cooldownInfo = this.getCooldownStopsInfo(this.selectedItems)

      this.$emit('handleSubmitStops', {
        stopIds: itemIds,
        cooldownStopIds: cooldownInfo.cooldownStopIds,
        allInCooldown: cooldownInfo.allInCooldown,
        maxBackdateDays: this.maxBackdateDays,
        cooldownDays: this.cooldownDays,
      })
    },
    getColumnSortName() {
      const columnName = Array.isArray(this.sortBy)
        ? this.sortBy[0]
        : this.sortBy
      const columnToSort = this.headers.filter(headerObj => {
        return headerObj.value === columnName
      })
      if (columnToSort.length) {
        return columnToSort[0].sortName
      } else {
        return null
      }
    },
  },

  watch: {
    items(val) {
      this.stops = val
    },
    search(val) {
      // call API to search error codes here
      if (val) {
        this.callErrorCodeSearch(val)
      }
    },
    errorCodeSearch() {
      this.errorCodesLoading = false
    },
    sortDesc: function (newValue, oldValue) {
      if (newValue === undefined) {
        // this means you're removing the sort on this column
        this.handleFilter()
      } else {
        if (newValue !== oldValue) {
          this.handleFilter()
        }
      }
    },
    selectedErrorCodes() {
      this.handleFilter()
    },
    savedFilters(newValue) {
      if (!newValue?.offset) {
        this.currentPage = 1
      } else {
        this.currentPage = newValue.offset / this.itemsPerPage + 1
      }
    },
    showingVersionTwoStops(value) {
      if (value) {
        this.version = 2
        this.handleFilter()
      } else {
        this.version = 1
        this.handleFilter()
      }
    },
  },

  created() {
    this.init()
    if (new Date() >= new Date(2024, 3, 1, 0, 0, 0, 0) && !this.savedFilters) {
      this.version = 2
      this.showingVersionTwoStops = true
    } else if (!this.savedFilters) {
      this.version = 1
      this.showingVersionTwoStops = false
    }
    this.handleFilter()
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Object,
      default: () => {},
    },
    onEdit: {
      type: Function,
      default: () => {},
    },
    errorCodeSearch: {
      type: Object,
      default: () => {},
    },
    savedFilters: {
      type: Object,
    },
  },
}
</script>

<style lang="scss">
.stopsGridContainer {
  margin: 0px;

  .stopsSummary {
    display: flex;
    padding: 15px;
    border: 1px solid #333;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 20px;

    > p {
      flex: 1;
      margin-bottom: 0px;

      span {
        display: block;
        text-align: center;
      }

      span.label {
        font-size: 1.2rem;
        font-weight: bold;
      }

      span.count {
        color: #2196f3;
      }
    }
  }

  .paginationWrapper {
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-wrap: wrap;

    p {
      margin: 0;
    }

    .itemsPerPageSelector {
      max-width: 150px;
      margin-left: 10px;
      margin-top: 10px;
    }
  }
}

.custom-tooltip {
  opacity: var(--v-tooltip-opacity, 1) !important;
  background: var(--v-tooltip-bg, #1976d2) !important;
}

.late-submission-icon {
  margin-left: 4px;
  margin-bottom: 2px;
  font-size: 18px !important;
  vertical-align: middle;
}
</style>
