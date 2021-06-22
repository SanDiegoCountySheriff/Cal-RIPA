<template>
  <v-container class="submissionDetail--container tw-mt-2" fluid>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <v-layout v row>
      <v-flex xs12>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase submissionDetail--titleBar"
            >Submission Details</v-toolbar-title
          >
          <v-btn @click="handleBackToSubmissions" class="backToSubmissionsBtn">
            Back to Submissions
          </v-btn>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout v-if="!loading" row class="submissionDetail--header">
      <v-flex xs3>
        <span class="submissionDetail--header--label">Submission ID:</span>
        <span>{{ submission.submission.id }}</span>
      </v-flex>
      <v-flex xs3>
        <span class="submissionDetail--header--label">Date Submitted:</span>
        <span>{{
          format(
            new Date(submission.submission.dateSubmitted),
            'yyyy-MM-dd kk:mm',
          )
        }}</span>
      </v-flex>
      <v-flex xs2>
        <span class="submissionDetail--header--label">Stop Date Start:</span>
        <span>{{
          format(
            new Date(submission.submission.dateSubmitted),
            'yyyy-MM-dd kk:mm',
          )
        }}</span>
      </v-flex>
      <v-flex xs2>
        <span class="submissionDetail--header--label">Stop Date End:</span>
        <span>{{
          format(
            new Date(submission.submission.dateSubmitted),
            'yyyy-MM-dd kk:mm',
          )
        }}</span>
      </v-flex>
    </v-layout>
    <v-layout v-if="submission" row>
      <v-flex v-if="submission" xs12>
        <div v-if="submission.summary.length" class="submissionSummary">
          <p v-for="(errorCode, index) in submission.summary" :key="index">
            <span class="label">{{ errorCode.code }}</span>
            <span class="count">{{ errorCode.count }}</span>
          </p>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          class="submissionsStopTable"
          :loading="loading"
          :headers="headers"
          :hide-default-footer="true"
          :items="submission.stops"
          :server-items-length="getTotalStops"
          :search="search"
          sort-by="stopDateTime"
          sort-desc
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="tw-mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
          <template :item-class="stopError" v-slot:item.error="{ item }">
            <div class="stopError" v-html="item.error"></div>
          </template>
          <template v-slot:item.edited="{ item }">
            {{ item.listSubmission.length ? 'Yes' : 'No' }}
          </template>
          <template v-slot:no-data>
            <div>No Stops Found in This Submission</div>
          </template>
          <template v-slot:footer>
            <div class="paginationWrapper">
              <p>
                Items {{ calculateItemsFrom }} - {{ calculateItemsTo }} of
                {{ submission.submission.recordCount }}
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
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { format } from 'date-fns'
import RipaEditStopMixin from '../mixins/RipaEditStopMixin'

export default {
  name: 'ripa-submission',

  data() {
    return {
      headers: [
        { text: 'Stop', value: 'id' },
        { text: 'Status', value: 'status', width: 100 },
        { text: 'Edited', value: 'edited', width: 100 },
        { text: 'Error', value: 'error', sortable: false },
        { text: 'Actions', value: 'actions' },
      ],
      format,
      currentSubmissionLoading: false,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250],
      itemsPerPage: 10,
      search: '',
      currentOffset: this.currentPage * this.itemsPerPage,
    }
  },

  mixins: [RipaEditStopMixin],

  methods: {
    handleBackToSubmissions() {
      this.$router.push('/admin/submissions')
    },
    handleNextPage() {
      // the pagination component updates the current page
      // BEFORE these are called but this math is based on the
      // current value. So need to subtract 1
      this.$emit('submissionDetailPaginate', {
        id: this.submissionId,
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handlePreviousPage() {
      this.$emit('submissionDetailPaginate', {
        id: this.submissionId,
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handleJumpToPage() {
      this.$emit('submissionDetailPaginate', {
        id: this.submissionId,
        offset: this.itemsPerPage * (this.currentPage - 1),
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
    },
    handleUpdateItemsPerPage(val) {
      this.itemsPerPage = val
      // calculate the page you SHOULD be on with the new items per page
      const newPage = Math.ceil(this.currentPage / this.itemsPerPage)
      this.$emit('redoSubmissionDetailItemsPerPage', {
        id: this.submissionId,
        limit: this.itemsPerPage,
        offset: this.itemsPerPage * (newPage - 1),
      })
    },
    editItem(item) {
      this.handleEditStop(item, window.location.pathname)
    },
  },

  computed: {
    getTotalStops() {
      if (this.submission) {
        return this.submission.submission.recordCount
      } else {
        return 0
      }
    },
    getPaginationLength() {
      if (this.submission) {
        return Math.ceil(
          this.submission.submission.recordCount / this.itemsPerPage,
        )
      } else {
        return 0
      }
    },
    calculateItemsTo() {
      if (this.currentPage === this.getPaginationLength) {
        return this.submission.submission.recordCount
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
  },

  created() {
    if (this.submissionId) {
      // this.$emit('loadNewSubmission', newValue)
    }
  },

  watch: {
    submissionId(newValue, oldValue) {
      this.currentSubmissionLoading = true
      if (newValue !== oldValue) {
        this.$emit('loadNewSubmission', newValue)
      }
    },
  },

  props: {
    submissionId: {
      type: String,
    },
    submission: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
  },
}
</script>

<style lang="scss">
.submissionDetail--container {
  button.backToSubmissionsBtn {
    margin-left: 20px;
    border: 1px solid #666;
  }
}

.submissionDetail--header {
  padding: 16px;
  span {
    display: block;
    margin-right: 8px;
  }

  span.submissionDetail--header--label {
    font-weight: bold;
  }
}

.submissionSummary {
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

.submissionsStopTable {
  .submissionError--wrapper {
    margin: 0;
    max-width: 400px;
  }

  .stopError p {
    margin: 0px;
  }
}
</style>
