<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row wrap>
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

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="errorsFound"
            class="tw-ml-2"
            label="Errors Found"
          ></v-switch>
          <v-switch
            v-model="isPiiFound"
            class="tw-ml-2"
            label="PII Found"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-autocomplete
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
          v-model="selectedItems"
          :loading="loading"
          :headers="headers"
          :items="getSubmissions"
          :single-select="false"
          :items-per-page="10"
          :search="search"
          sort-by="submissionDateStr"
          sort-desc
          show-select
          :footer-props="{
            itemsPerPageOptions: [10, 25, 50, 100, 250, -1],
          }"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="tw-uppercase"
                >Admin: Submissions</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="handleSubmit"
                :disabled="selectedItems.length === 0"
              >
                Submit Selected Items
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
          <template v-slot:item.errorsFound="{ item }">
            <v-simple-checkbox
              v-model="item.errorsFound"
              disabled
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.isPiiFound="{ item }">
            <v-simple-checkbox
              v-model="item.isPiiFound"
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
import { format, isAfter, isBefore } from 'date-fns'
import { SUBMISSION_STATUSES } from '../../constants/stop'

export default {
  name: 'ripa-submissions-grid',

  components: {
    RipaDatePicker,
  },

  data() {
    return {
      search: '',
      submissions: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Stop Date', value: 'submissionDateStr' },
        { text: 'Status', value: 'status' },
        { text: 'Errors', value: 'errorsFound' },
        { text: 'PII Found', value: 'isPiiFound' },
      ],
      submitted: false,
      editedIndex: -1,
      isPiiFound: false,
      errorsFound: false,
      officerName: null,
      selectedItems: [],
      submissionDate: null,
    }
  },

  computed: {
    getSubmissions() {
      let filteredItems = this.submissions

      if (this.errorsFound) {
        filteredItems = filteredItems.filter(item => item.errorsFound)
      }

      if (this.isPiiFound) {
        filteredItems = filteredItems.filter(item => item.isPiiFound)
      }

      if (this.submissionDate) {
        filteredItems = filteredItems.filter(
          item => item.submissionDateStr === this.submissionDate,
        )
      }

      if (!this.submitted) {
        filteredItems = filteredItems.filter(
          item => item.submissionDate === null,
        )
      }

      return filteredItems
    },

    getSubmissionDates() {
      return [
        '2021-04-23T18:23:59Z',
        '2021-02-09T08:35:36Z',
        '2021-01-06T10:05:45Z',
        '2020-11-25T19:55:21Z',
      ].map(item => format(new Date(item), 'yyyy-MM-dd kk:mm'))
    },
  },

  methods: {
    init() {
      this.submissions = this.items
    },

    editItem(item) {
      this.editedIndex = this.submissions.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },

    handleSubmit() {
      console.log(this.selectedItems)
    },
  },

  watch: {
    items(val) {
      this.submissions = val
    },
    submitted(val) {
      if (!val) {
        this.submissionDate = null
      }
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
