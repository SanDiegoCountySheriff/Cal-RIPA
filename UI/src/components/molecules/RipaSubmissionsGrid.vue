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
              @input="submissionFromDateChange"
            ></ripa-date-picker>
          </div>
        </v-flex>

        <v-flex xs12 md2>
          <div class="tw-ml-2">
            <ripa-date-picker
              v-model="submissionToDate"
              class="tw-ml-2"
              label="Submission To Date"
              @input="submissionToDateChange"
            ></ripa-date-picker>
          </div>
        </v-flex>

        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>

        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="getSubmissions"
            :hide-default-footer="true"
            :server-items-length="getSubmissions.length"
            :search="search"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
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
            <template v-slot:footer>
              <div class="paginationWrapper">
                <p>
                  Items {{ calculateItemsFrom }} - {{ calculateItemsTo }} of
                  {{ totalSubmissions }}
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
    <ripa-submission
      v-if="this.$route.params.submissionId"
      :submissionId="this.$route.params.submissionId"
      :submission="currentSubmission"
      :loading="loading"
      @submissionDetailPaginate="handleSubmissionDetailPaginate"
      @redoSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
    ></ripa-submission>
  </div>
</template>

<script>
import RipaDatePicker from '@/components/atoms/RipaDatePicker'
import RipaSubmission from '@/components/molecules/RipaSubmission'
import { format } from 'date-fns'

export default {
  name: 'ripa-submissions-grid',

  components: {
    RipaDatePicker,
    RipaSubmission,
  },

  data() {
    return {
      search: '',
      submissions: [],
      totalSubmissions: 0,
      headers: [
        { text: 'ID', value: 'id', sortable: true, sortName: 'id' },
        {
          text: 'Submission Date',
          value: 'dateSubmitted',
          sortName: 'dateSubmitted',
          sortable: true,
        },
        {
          text: 'Total Stops',
          value: 'recordCount',
          sortable: true,
          sortName: 'recordCount',
        },
        {
          text: 'Officer Name',
          value: 'officerName',
          sortName: 'officerName',
          sortable: true,
        },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      selectedItems: [],
      submissionFromDate: null,
      submissionToDate: null,
      currentSubmissionLoading: false,
      format,
      currentPage: 1,
      itemsPerPageOptions: [10, 25, 50, 100, 250],
      itemsPerPage: 10,
      currentOffset: this.currentPage * this.itemsPerPage,
      sortBy: 'dateSubmitted',
      sortDesc: true,
    }
  },

  computed: {
    getSubmissions() {
      return this.submissions
    },
    getFormattedDate(whichDate) {
      return format(new Date(whichDate), 'yyyy-MM-dd kk:mm')
    },
    getPaginationLength() {
      return Math.ceil(this.totalSubmissions / this.itemsPerPage)
    },
    calculateItemsTo() {
      if (this.currentPage === this.getPaginationLength) {
        return this.totalSubmissions
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
        submissionFromDate: this.submissionFromDate,
        submissionToDate: this.submissionToDate,
        orderBy:
          // if the column sort name is null, default to sorting by the stop date
          this.getColumnSortName() === null
            ? 'dateSubmitted'
            : this.getColumnSortName(),
        order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
      }
    },
  },

  methods: {
    handleGoToSubmission(whichSubmission) {
      this.currentSubmissionLoading = true
      this.$router.push(`/admin/submissions/${whichSubmission.id}`)
    },
    handleUpdateItemsPerPage(val) {
      this.itemsPerPage = val
      // calculate the page you SHOULD be on with the new items per page
      const newPage = Math.ceil(this.currentPage / this.itemsPerPage)
      this.currentPage = newPage
      this.$emit('redoItemsPerPage', {
        limit: this.itemsPerPage,
        offset: this.itemsPerPage * (newPage - 1),
      })
    },
    handleSubmissionDetailItemsPerPage(pageData) {
      this.$emit('handleSubmissionDetailItemsPerPage', pageData)
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
    handleSubmissionDetailPaginate(pageData) {
      this.$emit('handleSubmissionDetailPaginate', pageData)
    },
    submissionFromDateChange(val) {
      this.submissionFromDate = val
      this.handleFilter()
    },
    submissionToDateChange(val) {
      this.submissionToDate = val
      this.handleFilter()
    },
    handleFilter() {
      // whenever you change a filter, you're going to
      // reset the paging because it would all change with new settings
      let sortOrder = this.sortDesc
      if (Array.isArray(this.sortDesc)) {
        sortOrder = this.sortDesc[0]
      }
      const filterData = {
        offset: null,
        limit: this.itemsPerPage,
        filters: {
          submissionFromDate: this.submissionFromDate,
          submissionToDate: this.submissionToDate,
          orderBy:
            // if the column sort name is null, default to sorting by the stop date
            this.getColumnSortName() === null
              ? 'dateSubmitted'
              : this.getColumnSortName(),
          order: sortOrder || sortOrder === undefined ? 'Desc' : 'Asc',
        },
      }
      this.currentPage = 1
      this.$emit('handleFilter', filterData)
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
      this.submissions = val.submissions
      this.totalSubmissions = val.total
    },
    currentSubmission(val) {
      if (val) {
        this.currentSubmissionLoading = false
      }
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
    currentSubmission: {
      type: Object,
    },
  },
}
</script>

<style lang="scss">
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
</style>
