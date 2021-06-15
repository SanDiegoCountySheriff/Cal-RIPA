<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap class="stopsGridContainer">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopFromDate"
            class="tw-ml-2"
            label="Stop From Date"
            @input="fromDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopToDate"
            class="tw-ml-2"
            label="Stop To Date"
            @input="toDateChange"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <v-select
          class="tw-ml-2"
          :items="statuses"
          label="Status"
          clearable
          @change="statusChange"
        ></v-select>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isPiiFound"
            class="tw-ml-2"
            label="PII Found"
            @change="piiChange"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md4>
        <div class="tw-flex tw-justify-center">
          <v-autocomplete
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
          ></v-autocomplete>
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
            <span class="label">Not Submitted</span>
            <span class="count">{{ stops.summary.unsubmitted }}</span>
          </p>
          <p>
            <span class="label">Errors</span>
            <span class="count">{{ stops.summary.failed }}</span>
          </p>
          <p>
            <span class="label">Resubmit</span>
            <span class="count">{{ stops.summary.resubmitted }}</span>
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
          :search="search"
          sort-by="stopDateStr"
          sort-desc
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="tw-uppercase"
                >Admin: Stops</v-toolbar-title
              >
              <v-btn @click="handleSubmitAll" class="submitAllBtn">
                Submit All Stops to DOJ
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn
                @click="handleSubmitSelected"
                class="submitSelectedBtn"
                v-if="selectedItems.length > 0"
              >
                Submit Selected Stops ({{ selectedItems.length }})
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="tw-mr-2" @click="editItem(item)">
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
        { text: 'ID', value: 'id' },
        { text: 'Stop Date', value: 'stopDateTime' },
        { text: 'Status', value: 'status' },
        { text: 'PII Found', value: 'isPiiFound' },
        { text: 'Officer Name', value: 'officerName' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      isPiiFound: false,
      errorsFound: false,
      officerName: null,
      selectedItems: [],
      selectedErrorCodes: [],
      stopFromDate: null,
      stopToDate: null,
      currentStatusFilter: null,
      statuses: SUBMISSION_STATUSES,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250],
      itemsPerPage: 10,
      currentOffset: this.currentPage * this.itemsPerPage,
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
          text: itemObj.code,
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
        return this.currentPage - 1 + this.itemsPerPage
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
      return {
        isPiiFound: this.isPiiFound,
        stopFromDate: this.stopFromDate,
        stopToDate: this.stopToDate,
        status: this.currentStatusFilter,
      }
    },
  },

  methods: {
    init() {
      this.stops = this.items
    },

    handleUpdateItemsPerPage(val) {
      this.itemsPerPage = val
      // calculate the page you SHOULD be on with the new items per page
      const newPage = Math.ceil(this.currentPage / this.itemsPerPage)
      this.$emit('redoItemsPerPage', {
        type: 'stops',
        limit: this.itemsPerPage,
        offset: this.itemsPerPage * (newPage - 1),
      })
    },
    handleNextPage() {
      // the pagination component updates the current page
      // BEFORE these are called but this math is based on the
      // current value. So need to subtract 1
      this.$emit('paginate', {
        offset: this.itemsPerPage * (this.currentPage - 1) + 1,
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
        offset: this.itemsPerPage * (this.currentPage - 1) + 1,
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
      this.handleEditStop(item, window.location.pathname)
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
      this.isPiiFound = val
      this.handleFilter()
    },
    handleFilter() {
      // whenever you change a filter, you're going to
      // reset the paging because it would all change with new settings
      const filterData = {
        offset: null,
        limit: this.itemsPerPage,
        filters: {
          stopFromDate: this.stopFromDate,
          stopToDate: this.stopToDate,
          status: this.currentStatusFilter,
          isPiiFound: this.isPiiFound,
          // need to make a comma delimited string out of the error codes
          errorCodes: this.selectedErrorCodes.join(),
        },
      }
      this.$emit('handleAdminStopsFiltering', filterData)
    },
    handleSubmitAll() {
      this.$emit('handleSubmitAll')
    },
    handleSubmitSelected() {
      const itemIds = this.selectedItems.map(itemObj => {
        return itemObj.id
      })
      this.$emit('handleSubmitStops', itemIds)
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
    }
  }

  .paginationWrapper {
    display: flex;
    justify-content: center;
    align-items: baseline;

    p {
      margin: 0;
    }

    .itemsPerPageSelector {
      max-width: 150px;
      margin-left: 10px;
    }
  }
}
</style>
