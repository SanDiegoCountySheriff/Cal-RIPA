<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap class="stopsGridContainer">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopFromDate"
            class="tw-ml-2"
            label="From Date"
            @input="fromDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopToDate"
            class="tw-ml-2"
            label="To Date"
            @input="toDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <v-select
          v-model="currentStatusFilter"
          class="tw-ml-2"
          :items="statuses"
          label="Status"
          clearable
          @change="statusChange"
        ></v-select>
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

      <v-flex xs12 md4>
        <div class="tw-flex tw-justify-center">
          <v-autocomplete
            v-model="selectedErrorCodes"
            :items="getErrorCodeSearchItems"
            :loading="errorCodesLoading"
            @input="handleChangeSearchCodes"
            cache-items
            :search-input.sync="search"
            multiple
            dense
            chips
            deletable-chips
            small-chips
            label="Error Codes"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
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
            <span class="label">Submitted</span>
            <span class="count">{{ stops.summary.submitted }}</span>
          </p>
          <p>
            <span class="label">Unsubmitted</span>
            <span class="count">{{ stops.summary.unsubmitted }}</span>
          </p>
          <p>
            <span class="label">Errors</span>
            <span class="count">{{ stops.summary.failed }}</span>
          </p>
        </div>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="cyan"
        ></v-progress-linear>
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
          @item-selected="handleRowSelected"
          @toggle-select-all="handleToggleSelectAll"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :search="search"
        >
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
                    class="submitAllBtn"
                  >
                    Submit All Stops to DOJ
                  </v-btn>
                </template>
                <span
                  >Submit all the stops to the DOJ. Stops with PII or that are
                  in an error state will not be resubmitted.</span
                >
              </v-tooltip>

              <v-spacer></v-spacer>

              <v-btn
                @click="handleSubmitSelected"
                class="submitSelectedBtn"
                v-if="selectedItems.length > 0"
              >
                Submit Selected Stops to DOJ ({{ selectedItems.length }})
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              v-if="statuses.find(s => s.text === item.status).isEditable"
              small
              class="tw-mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
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
                @input="handleUpdateItemsPerPage"
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
import { SUBMISSION_STATUSES } from '../../constants/stop'
import RipaEditStopMixin from '../mixins/RipaEditStopMixin'
import _ from 'lodash'
import { isAfter, getYear } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export default {
  name: 'ripa-stops-grid',

  components: {
    RipaDatePicker,
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
      isPiiFound: this.savedFilters.isPiiFound
        ? this.savedFilters.isPiiFound
        : null,
      isEdited: this.savedFilters.isEdited ? this.savedFilters.isEdited : null,
      errorsFound: this.savedFilters.isEdited
        ? this.savedFilters.isEdited
        : null,
      officerName: null,
      selectedItems: [],
      selectedErrorCodes: this.savedFilters.errorCodes
        ? this.savedFilters.errorCodes
        : [],
      stopFromDate: null,
      stopToDate: this.savedFilters.toDate ? this.savedFilters.toDate : null,
      currentStatusFilter: this.savedFilters.status
        ? this.savedFilters.status
        : null,
      statuses: SUBMISSION_STATUSES,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250, 500, 1000],
      itemsPerPage: this.savedFilters.itemsPerPage
        ? this.savedFilters.itemsPerPage
        : 10,
      currentOffset: this.currentPage * this.itemsPerPage,
      sortBy: 'StopDateTime',
      sortDesc: true,
    }
  },

  computed: {
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
      if (this.currentPage === this.getPaginationLength) {
        return this.stops.summary.total
      } else {
        return this.currentPage * this.itemsPerPage
      }
    },
    calculateItemsFrom() {
      if (this.currentPage === 1) {
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
    init() {
      this.stops = this.items
      // if the user has a from date saved in session storage
      // this overrides any date checking
      if (this.savedFilters.fromDate) {
        this.stopFromDate = this.savedFilters.fromDate
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
      if (!_.isEmpty(this.savedFilters)) {
        if (this.savedFilters.errorCodes) {
          this.savedFilters.errorCodes.forEach(errorCodeVal => {
            this.callErrorCodeSearch(errorCodeVal)
          })
        }
        this.handleFilter()
      }
    },

    handleUpdateItemsPerPage(val) {
      this.itemsPerPage = val
      // calculate the page you SHOULD be on with the new items per page
      const newPage = Math.ceil(this.currentPage / this.itemsPerPage)
      this.currentPage = newPage
      this.$emit('redoItemsPerPage', {
        type: 'stops',
        limit: this.itemsPerPage,
        offset: this.itemsPerPage * (newPage - 1),
        filters: this.getFilterStatus,
      })
      this.$emit('handleUpdateSavedFilter', {
        itemsPerPage: val,
      })
    },
    handleNextPage() {
      // the pagination component updates the current page
      // BEFORE these are called but this math is based on the
      // current value. So need to subtract 1
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handlePreviousPage() {
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handleJumpToPage() {
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handleRowSelected(item) {
      if (item.value) {
        this.selectedItems.push(item.item)
      } else {
        this.selectedItems = this.selectedItems.filter(itemObj => {
          return itemObj.id !== item.item.id
        })
      }
    },

    handleToggleSelectAll(item) {
      if (item.value) {
        this.selectedItems = item.items
      } else {
        item.items.forEach(selectedItemObj => {
          this.selectedItems = this.selectedItems.filter(itemObj => {
            return itemObj.id !== selectedItemObj.id
          })
        })
      }
    },

    editItem(item) {
      this.handleEditStopByAdmin(item, window.location.pathname)
    },
    callErrorCodeSearch: _.debounce(function (val) {
      this.errorCodesLoading = true
      this.$emit('callErrorCodeSearch', val)
    }, 400),
    handleChangeSearchCodes(val) {
      // need to call getStops API here with search codes
      this.selectedErrorCodes = val
      this.handleFilter()
    },
    removeErrorCode(val) {
      this.selectedErrorCodes = this.selectedErrorCodes.filter(errorCode => {
        return errorCode !== val.value
      })
      this.handleFilter()
    },
    fromDateChange(val) {
      this.stopFromDate = val
      this.$emit('handleUpdateSavedFilter', {
        fromDate: val,
      })
      this.handleFilter()
    },
    toDateChange(val) {
      this.stopToDate = val
      this.$emit('handleUpdateSavedFilter', {
        toDate: val,
      })
      this.handleFilter()
    },
    statusChange(val) {
      this.currentStatusFilter = val
      this.$emit('handleUpdateSavedFilter', {
        status: val,
      })
      this.handleFilter()
    },
    piiChange(val) {
      if (!val) {
        this.isPiiFound = null
        this.$emit('handleUpdateSavedFilter', {
          isPiiFound: null,
        })
      } else {
        this.isPiiFound = true
        this.$emit('handleUpdateSavedFilter', {
          isPiiFound: true,
        })
      }
      this.handleFilter()
    },
    isEditedChange(val) {
      if (!val) {
        this.isEdited = null
        this.$emit('handleUpdateSavedFilter', {
          isEdited: null,
        })
      } else {
        this.isEdited = true
        this.$emit('handleUpdateSavedFilter', {
          isEdited: true,
        })
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
        offset: null,
        limit: this.itemsPerPage,
        filters: {
          stopFromDate: this.stopFromDate,
          stopToDate: this.stopToDate,
          status: this.currentStatusFilter,
          isPiiFound: this.isPiiFound,
          isEdited: this.isEdited,
          // need to make a comma delimited string out of the error codes
          errorCodes: this.selectedErrorCodes.join(),
          orderBy:
            // if the column sort name is null, default to sorting by the stop date
            this.getColumnSortName() === null
              ? 'StopDateTime'
              : this.getColumnSortName(),
          order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
        },
      }
      this.currentPage = 1
      this.$emit('handleAdminStopsFiltering', filterData)
    },
    handleSubmitAll() {
      const filterData = {
        stopFromDate: this.stopFromDate,
        stopToDate: this.stopToDate,
        status: this.currentStatusFilter,
        isPiiFound: this.isPiiFound,
        isEdited: this.isEdited,
        // need to make a comma delimited string out of the error codes
        errorCodes: this.selectedErrorCodes.join(),
      }
      this.$emit('handleSubmitAll', filterData)
    },
    handleSubmitSelected() {
      const itemIds = this.selectedItems.map(itemObj => {
        return itemObj.id
      })
      this.$emit('handleSubmitStops', itemIds)
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
    errorCodeSearch(val) {
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
    selectedErrorCodes(newValue) {
      this.$emit('handleUpdateSavedFilter', {
        errorCodes: newValue,
      })
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
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.stopsGridContainer {
  margin: 0px;

  .adminStopsTable {
    .submitAllBtn {
      margin-left: 20px;
    }

    .submitAllBtn,
    .submitSelectedBtn {
      border: 1px solid #666;
    }
  }

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
</style>
