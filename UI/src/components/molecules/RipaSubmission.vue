<template>
  <div>
    <v-progress-linear
      v-if="loading && !submission"
      indeterminate
      color="primary"
      class="tw-mt-3"
    ></v-progress-linear>
    <v-container
      class="submissionDetail--container tw-mt-2"
      fluid
      v-if="submission"
    >
      <v-layout v row wrap>
        <v-flex xs12>
          <v-toolbar flat>
            <v-toolbar-title class="tw-uppercase submissionDetail--titleBar"
              >Submission Details</v-toolbar-title
            >
            <v-btn
              @click="handleBackToSubmissions"
              class="backToSubmissionsBtn"
            >
              Back to Submissions
            </v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>
      <v-layout v-if="!loading" row class="submissionDetail--header" wrap>
        <v-flex xs3>
          <span class="submissionDetail--header--label">Submission ID:</span>
          <span>{{ submission.submission.id }}</span>
        </v-flex>
        <v-flex xs4>
          <span class="submissionDetail--header--label">Date Submitted:</span>
          <span
            >{{
              format(
                new Date(submission.submission.dateSubmitted),
                'yyyy-MM-dd kk:mm',
              )
            }}<br />(Note: It can take up to 48 hours for stop statuses to
            update below.)</span
          >
        </v-flex>
        <v-flex xs2>
          <span class="submissionDetail--header--label"
            >Submission Stops From Date:</span
          >
          <span>{{
            format(
              new Date(submission.submission.minStopDate),
              'yyyy-MM-dd kk:mm',
            )
          }}</span>
        </v-flex>
        <v-flex xs2>
          <span class="submissionDetail--header--label"
            >Submission Stops To Date:</span
          >
          <span>{{
            format(
              new Date(submission.submission.maxStopDate),
              'yyyy-MM-dd kk:mm',
            )
          }}</span>
        </v-flex>
      </v-layout>
      <v-layout v-if="submission" row wrap>
        <v-flex v-if="submission" xs12>
          <div v-if="submission.summary.length" class="submissionSummary">
            <p v-for="(errorCode, index) in submission.summary" :key="index">
              <span class="label">{{ errorCode.code }}</span>
              <v-btn
                :class="{
                  activeFilter: currentErrorCodeFilter === errorCode.code,
                }"
                @click="handleChangeErrorCodeFilter(errorCode.code)"
                text
                >{{ errorCode.count }}</v-btn
              >
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
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
          >
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
            <template v-slot:item.error="{ item }">
              <div class="stopError" v-html="item.error"></div>
            </template>
            <template v-slot:item.edited="{ item }">
              {{ item.isEdited ? 'Yes' : 'No' }}
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
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { format } from 'date-fns'
import RipaEditStopMixin from '../mixins/RipaEditStopMixin'
import { SUBMISSION_STATUSES } from '../../constants/stop'

export default {
  name: 'ripa-submission',

  data() {
    return {
      headers: [
        { text: 'Stop', value: 'id', sortName: 'id' },
        { text: 'Status', value: 'status', width: 100, sortName: 'Status' },
        { text: 'Edited', value: 'edited', width: 100, sortName: 'IsEdited' },
        {
          text: 'Error (errors from this submission are highlighted)',
          value: 'error',
          sortable: false,
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      format,
      currentSubmissionLoading: false,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250, 500, 1000],
      itemsPerPage: 10,
      search: '',
      statuses: SUBMISSION_STATUSES,
      currentOffset: this.currentPage * this.itemsPerPage,
      sortBy: null,
      sortDesc: true,
      currentErrorCodeFilter: null,
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
    handleSort() {
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
      this.currentPage = newPage
      this.$emit('redoSubmissionDetailItemsPerPage', {
        id: this.submissionId,
        limit: this.itemsPerPage,
        offset: this.itemsPerPage * (newPage - 1),
        filters: this.getFilterStatus,
      })
    },
    editItem(item) {
      this.handleEditStopByAdmin(item, window.location.pathname)
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
    handleChangeErrorCodeFilter(whichCode) {
      if (whichCode !== this.currentErrorCodeFilter) {
        this.currentErrorCodeFilter = whichCode
      } else {
        this.currentErrorCodeFilter = null
      }
      this.$emit('submissionDetailPaginate', {
        id: this.submissionId,
        limit: this.itemsPerPage,
        filters: this.getFilterStatus,
      })
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
    getFilterStatus() {
      let filters = null
      if (this.getColumnSortName() !== null) {
        let sortOrder = this.sortDesc
        if (Array.isArray(this.sortDesc)) {
          sortOrder = this.sortDesc[0]
        }
        filters = {
          orderBy:
            // if the column sort name is null, default to sorting by the stop date
            this.getColumnSortName() === null
              ? 'dateSubmitted'
              : this.getColumnSortName(),
          order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
        }
      }
      if (this.currentErrorCodeFilter !== null) {
        filters = {
          ...filters,
          errorCode: this.currentErrorCodeFilter,
        }
      }
      return filters
    },
  },

  watch: {
    submissionId(newValue, oldValue) {
      this.currentSubmissionLoading = true
      if (newValue !== oldValue) {
        this.$emit('loadNewSubmission', newValue)
      }
    },
    sortDesc: function (newValue, oldValue) {
      if (newValue === undefined) {
        // this means you're removing the sort on this column
        this.handleSort()
      } else {
        if (newValue !== oldValue) {
          this.handleSort()
        }
      }
    },
  },

  props: {
    submissionId: {
      type: String,
      default: '',
    },
    submission: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
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
    display: flex;
    flex-direction: column;
    align-items: center;

    .v-btn {
      font-size: 1.1rem;
      font-weight: normal;
      color: #2196f3;
      max-width: 100px;

      &.activeFilter {
        background: #e3e3e3;
        font-weight: bold;
      }
    }

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

.submissionsStopTable {
  .submissionError--wrapper {
    margin: 0;
    max-width: 400px;
  }

  .stopError p {
    margin: 0px;

    &.currentSubmission {
      color: #2196f3;
    }
  }
}
</style>
