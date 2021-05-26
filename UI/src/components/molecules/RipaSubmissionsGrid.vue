<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row wrap>
      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="submissionFromDate"
            class="tw-ml-2"
            label="Submission From Date"
          ></ripa-date-picker>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <div class="tw-ml-2">
          <ripa-date-picker
            v-model="submissionToDate"
            class="tw-ml-2"
            label="Submission To Date"
          ></ripa-date-picker>
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
          sort-by="submissionDateStr"
          sort-desc
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
              <v-btn small> Details </v-btn>
            </v-icon>
          </template>
          <template v-slot:item.dateSubmitted="{ item }">
            {{ format(new Date(item.dateSubmitted), 'yyyy-MM-dd kk:mm') }}
          </template>

          <template v-slot:no-data>
            <div>No Submissions Found</div>
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
        { text: 'Submission Date', value: 'dateSubmitted' },
        { text: 'Total Stops', value: 'recordCount' },
      ],
      editedIndex: -1,
      selectedItems: [],
      submissionFromDate: null,
      submissionToDate: null,
    }
  },

  computed: {
    getSubmissions() {
      return this.submissions
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
