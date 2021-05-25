<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap class="stopsGridContainer">
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopFromDate"
            class="tw-ml-2"
            label="Stop From Date"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="stopToDate"
            class="tw-ml-2"
            label="Stop To Date"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <v-select
          class="tw-ml-2"
          :items="statuses"
          label="Status"
          clearable
        ></v-select>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isPiiFound"
            class="tw-ml-2"
            label="PII Found"
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
        <div class="stopsSummary">
          <p>
            <span class="label">Total</span>
            <span class="count">6964</span>
          </p>
          <p>
            <span class="label">Submitted</span>
            <span class="count">4999</span>
          </p>
          <p>
            <span class="label">Not Submitted</span>
            <span class="count">614</span>
          </p>
          <p>
            <span class="label">Errors</span>
            <span class="count">1354</span>
          </p>
          <p>
            <span class="label">Resubmit</span>
            <span class="count">33</span>
          </p>
        </div>
        <v-data-table
          class="adminStopsTable"
          :loading="loading"
          :headers="headers"
          :single-select="false"
          show-select
          :items="getStops"
          :server-items-length="getTotalStops"
          :items-per-page="10"
          @update:page="handleUpdatePage"
          @update:sortBy="handleUpdateSort"
          @update:options="handleUpdateOptions"
          @item-selected="handleRowSelected"
          @toggle-select-all="handleToggleSelectAll"
          :search="search"
          sort-by="stopDateStr"
          sort-desc
          :footer-props="{
            itemsPerPageOptions: [10, 25, 50, 100, 250, -1],
          }"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="tw-uppercase"
                >Admin: Stops</v-toolbar-title
              >
              <v-btn class="submitAllBtn"> Submit All Stops to DOJ </v-btn>
              <v-spacer></v-spacer>

              <v-btn v-if="selectedItems.length > 0">
                Submit Selected Stops ({{ selectedItems.length }})
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="tw-mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
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
import subDays from 'date-fns/subDays'
import { format, isAfter, isBefore } from 'date-fns'
import { SUBMISSION_STATUSES } from '../../constants/stop'

import _ from 'lodash'

export default {
  name: 'ripa-stops-grid',

  components: {
    RipaDatePicker,
  },

  data() {
    return {
      search: '',
      errorCodesLoading: false,
      stops: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Stop Date', value: 'stopDateTime' },
        { text: 'Status', value: 'status' },
        { text: 'Errors Found', value: 'errorsFound' },
        { text: 'PII Found', value: 'isPiiFound' },
        { text: 'Officer Name', value: 'officerName' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      isPiiFound: false,
      errorsFound: false,
      officerName: null,
      selectedItems: [],
      stopFromDate: subDays(new Date(), 10).toISOString().substr(0, 10),
      stopToDate: new Date().toISOString().substr(0, 10),
      statuses: SUBMISSION_STATUSES,
    }
  },

  computed: {
    getStops() {
      let filteredItems = this.stops.map(item => {
        return {
          ...item,
          status: item.status === null ? 'Not Submitted' : item.status,
          stopDateInt: item.stopDate ? new Date(item.stopDate).getTime() : null,
          stopDateStr: item.stopDate
            ? format(new Date(item.stopDate), 'yyyy-MM-dd kk:mm')
            : null,
        }
      })

      if (this.errorsFound) {
        filteredItems = filteredItems.filter(item => item.errorsFound)
      }

      if (this.isPiiFound) {
        filteredItems = filteredItems.filter(item => item.isPiiFound)
      }

      if (this.officerName) {
        filteredItems = filteredItems.filter(
          item => item.officerName === this.officerName,
        )
      }

      filteredItems = filteredItems.filter(item => {
        return (
          isAfter(new Date(item.stopDateTime), new Date(this.stopFromDate)) &&
          isBefore(new Date(item.stopDateTime), new Date(this.stopToDate))
        )
      })

      return filteredItems
    },
    getTotalStops() {
      return this.stops.length
    },
    getOfficers() {
      return ['Bob', 'Joe', 'John', 'Sally', 'Mary', 'Jane']
    },
    getErrorCodeSearchItems() {
      return this.errorCodeSearch.items
    },
  },

  methods: {
    init() {
      this.stops = this.items
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
      this.editedIndex = this.stops.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
    callErrorCodeSearch: _.debounce(function (val) {
      this.errorCodesLoading = true
      this.$emit('callErrorCodeSearch', val)
    }, 400),
    handleChangeSearchCodes(val) {
      // need to call getStops API here with search codes
      console.log(val)
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
      type: Array,
      default: () => [],
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
}
</style>
