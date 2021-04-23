<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row wrap>
      <v-flex xs12 md2>
        <v-select
          v-model="officerName"
          class="tw-ml-2"
          :items="getOfficers"
          label="Officer"
          clearable
        ></v-select>
      </v-flex>

      <v-flex xs12 md2>
        <template v-if="isSubmissionDate">
          <div class="tw-ml-2">
            <ripa-date-picker
              v-model="submissionFromDate"
              label="Submission From Date"
            ></ripa-date-picker>
          </div>
        </template>
        <template v-if="!isSubmissionDate">
          <div class="tw-ml-2">
            <ripa-date-picker
              v-model="stopFromDate"
              class="tw-ml-2"
              label="Stop From Date"
            ></ripa-date-picker>
          </div>
        </template>
      </v-flex>

      <v-flex xs12 md2>
        <template v-if="isSubmissionDate">
          <div class="tw-ml-2">
            <ripa-date-picker
              v-model="submissionToDate"
              class="tw-ml-2"
              label="Submission To Date"
            ></ripa-date-picker>
          </div>
        </template>
        <template v-if="!isSubmissionDate">
          <div class="tw-ml-2">
            <ripa-date-picker
              v-model="stopToDate"
              class="tw-ml-2"
              label="Stop To Date"
            ></ripa-date-picker>
          </div>
        </template>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="isSubmissionDate"
            label="Filter by Submission Date"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-switch v-model="submitted" label="Submitted"></v-switch>
          <v-switch
            v-model="errorsFound"
            class="tw-ml-2"
            label="Errors"
          ></v-switch>
          <v-switch v-model="piiFound" class="tw-ml-2" label="PII"></v-switch>
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
          :items-per-page="10"
          :search="search"
          sort-by="submissionDate"
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

      <v-flex xs12>
        <div class="tw-p-4">
          <v-btn color="primary" @click="handleSubmit">
            Submit Selected Items
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import subDays from 'date-fns/subDays'

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
        { text: 'Submission Date', value: 'submissionDateStr' },
        { text: 'Stop Date', value: 'stopDateStr' },
        { text: 'Errors Found', value: 'errorsFound' },
        { text: 'PII Found', value: 'piiFound' },
        { text: 'Officer Name', value: 'officerName' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      isSubmissionDate: true,
      submitted: true,
      piiFound: false,
      errorsFound: false,
      officerName: null,
      selectedItems: [],
      submissionFromDate: subDays(new Date(), 10).toISOString().substr(0, 10),
      submissionToDate: new Date().toISOString().substr(0, 10),
      stopFromDate: subDays(new Date(), 10).toISOString().substr(0, 10),
      stopToDate: new Date().toISOString().substr(0, 10),
    }
  },

  computed: {
    getSubmissions() {
      let filteredItems = this.submissions

      if (!this.submitted) {
        filteredItems = filteredItems.filter(item => !item.submissionDate)
      }

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

      if (this.isSubmissionDate) {
        const fromDateInt = new Date(this.submissionFromDate).getTime()
        const toDateInt = new Date(this.submissionToDate).getTime()

        filteredItems = filteredItems.filter(
          item =>
            item.submissionDateInt >= fromDateInt &&
            item.submissionDateInt <= toDateInt,
        )
      }

      return filteredItems
    },

    getOfficers() {
      return [
        'John',
        'Bob',
        'Steve',
        'Lisa',
        'Betty',
        'Sarah',
        'Julie',
        'Anne',
        'Maddie',
        'Noah',
      ]
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
