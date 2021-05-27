<template>
  <div>
    <v-container v-if="!this.$route.params.submissionId" class="tw-mt-2" fluid>
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
              <v-btn small @click="handleGoToSubmission(item)">
                View Submission Details
              </v-btn>
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
    <!-- submission detail screen gets rendered here -->
    <v-progress-linear
      v-if="currentSubmissionLoading"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <router-view :submission="currentSubmission"></router-view>
  </div>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import { format } from 'date-fns'

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
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      selectedItems: [],
      submissionFromDate: null,
      submissionToDate: null,
      currentSubmissionLoading: false,
      format,
    }
  },

  computed: {
    getSubmissions() {
      return this.submissions
    },
    getFormattedDate(whichDate) {
      return format(new Date(whichDate), 'yyyy-MM-dd kk:mm')
    },
  },

  methods: {
    init() {
      this.submissions = this.items
    },

    handleGoToSubmission(whichSubmission) {
      this.currentSubmissionLoading = true
      this.$router.push(`/admin/submission/${whichSubmission.id}`)
    },
  },

  watch: {
    items(val) {
      this.submissions = val
    },
    currentSubmission(val) {
      if (val) {
        this.currentSubmissionLoading = false
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
    currentSubmission: {
      type: Object,
    },
  },
}
</script>
