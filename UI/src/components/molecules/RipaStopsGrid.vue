<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row align-center nowrap>
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
          v-model="status"
          class="tw-ml-2"
          :items="statuses"
          label="Status"
          clearable
        ></v-select>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="errorsFound"
            class="tw-ml-2"
            label="Errors Found"
          ></v-switch>
          <v-switch
            v-model="piiFound"
            class="tw-ml-2"
            label="PII Found"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-autocomplete
            v-model="codess"
            :items="items"
            dense
            chips
            deletable-chips
            small-chips
            label="Error Codes"
            multiple
          ></v-autocomplete>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-divider></v-divider>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          :loading="loading"
          :headers="headers"
          :show-select="true"
          :single-select="false"
          :items="getStops"
          :items-per-page="10"
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
          <template v-slot:item.errorsFound="{ item }">
            <v-simple-checkbox
              v-model="item.errorsFound"
              disabled
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.piiFound="{ item }">
            <v-simple-checkbox
              v-model="item.piiFound"
              disabled
            ></v-simple-checkbox>
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
import { format } from 'date-fns'
import { SUBMISSION_STATUSES } from '../../constants/stop'

export default {
  name: 'ripa-stops-grid',

  components: {
    RipaDatePicker,
  },

  data() {
    return {
      search: '',
      stops: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Stop Date', value: 'stopDateStr' },
        { text: 'Status', value: 'stopStatus' },
        { text: 'Errors Found', value: 'errorsFound' },
        { text: 'PII Found', value: 'piiFound' },
      ],
      editedIndex: -1,
      piiFound: false,
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
          stopDateInt: item.stopDate ? new Date(item.stopDate).getTime() : null,
          stopDateStr: item.stopDate
            ? format(new Date(item.stopDate), 'yyyy-MM-dd kk:mm')
            : null,
        }
      })

      if (this.errorsFound) {
        filteredItems = filteredItems.filter(item => item.errorsFound)
      }

      if (this.piiFound) {
        filteredItems = filteredItems.filter(item => item.piiFound)
      }

      if (this.officerName) {
        filteredItems = filteredItems.filter(
          item => item.officerName === this.officerName,
        )
      }

      const fromDateInt = new Date(this.stopFromDate).getTime()
      const toDateInt = new Date(this.stopToDate).getTime()

      filteredItems = filteredItems.filter(
        item =>
          item.stopDateInt >= fromDateInt && item.stopDateInt <= toDateInt,
      )

      return filteredItems
    },

    getOfficers() {
      return ['Bob', 'Joe', 'John', 'Sally', 'Mary', 'Jane']
    },
  },

  methods: {
    init() {
      this.stops = this.items
    },

    editItem(item) {
      this.editedIndex = this.stops.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },
  },

  watch: {
    items(val) {
      this.stops = val
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
  },
}
</script>
