<template>
  <v-container class="tw-mt-2" fluid>
    <v-progress-linear
      v-if="currentSubmissionLoading"
      indeterminate
      color="cyan"
    ></v-progress-linear>
    <v-layout row>
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
    <v-layout row class="submissionDetail--header">
      <v-flex xs4>
        <span class="submissionDetail--header--label">Submission ID:</span>
        <span>{{ submission.submission.id }}</span>
      </v-flex>
      <v-flex xs4>
        <span class="submissionDetail--header--label">Range:</span>
        <span>{{ submission.submission.range }}</span>
      </v-flex>
      <v-flex xs4>
        <span class="submissionDetail--header--label">Date Submitted:</span>
        <span>{{
          format(
            new Date(submission.submission.dateSubmitted),
            'yyyy-MM-dd kk:mm',
          )
        }}</span>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex v-if="submission.summary.length" xs12>
        <div class="submissionSummary">
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
          :single-select="false"
          :items="submission.stops"
          :server-items-length="getTotalStops"
          :items-per-page="10"
          @update:page="handleUpdatePage"
          @update:sortBy="handleUpdateSort"
          @update:options="handleUpdateOptions"
          @item-selected="handleRowSelected"
          @toggle-select-all="handleToggleSelectAll"
          :search="search"
          sort-by="stopDateTime"
          sort-desc
          :footer-props="{
            itemsPerPageOptions: [10, 25, 50, 100, 250, -1],
          }"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="tw-mr-2" @click="editItem(submission)">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:item.errorCodes="{ item }">
            <p
              class="submissionError--wrapper"
              v-for="(submissionObj, index) in item.listSubmission"
              :key="index"
            >
              <span v-if="submissionObj.error && submissionObj.error != null">
                {{ submissionObj.error.error }}
              </span>
            </p>
          </template>
          <template v-slot:item.edited="{ item }">
            {{ item.listSubmission.length ? 'Yes' : 'No' }}
          </template>
          <template v-slot:no-data>
            <div>No Data</div>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'ripa-submission',

  data() {
    return {
      headers: [
        { text: 'Stop', value: 'id' },
        { text: 'Status', value: 'status' },
        { text: 'Error Codes', value: 'errorCodes' },
        { text: 'Edited', value: 'edited' },
        { text: 'Message', value: 'isPiiFound' },
        { text: 'Actions', value: 'actions' },
      ],
      format,
      currentSubmissionLoading: false,
    }
  },

  methods: {
    handleBackToSubmissions() {
      this.$router.push('/admin')
    },
  },

  created() {
    if (this.submissionId) {
      this.currentSubmissionLoading = true
      // this.$emit('loadNewSubmission', newValue)
    }
  },

  watch: {
    submissionId(newValue, oldValue) {
      console.log(newValue)
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
  },
}
</script>

<style lang="scss">
.submissionDetail--titleBar {
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
}
</style>
