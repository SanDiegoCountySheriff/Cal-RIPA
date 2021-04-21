<template>
  <v-container class="tw-mt-2" fluid>
    <v-layout row wrap>
      <v-flex xs12 md3>
        <div class="tw-flex tw-justify-center">
          <v-switch
            v-model="submissionDate"
            label="Filter by Submission Date"
          ></v-switch>
        </div>
      </v-flex>

      <v-flex xs12 md2>
        <template v-if="submissionDate">
          <v-text-field
            class="tw-ml-2"
            append-icon="mdi-calendar"
            label="Submission From Date"
          ></v-text-field>
        </template>
        <template v-if="!submissionDate">
          <v-text-field
            class="tw-ml-2"
            append-icon="mdi-calendar"
            label="Stop From Date"
          ></v-text-field>
        </template>
      </v-flex>

      <v-flex xs12 md2>
        <template v-if="submissionDate">
          <v-text-field
            class="tw-ml-2"
            append-icon="mdi-calendar"
            label="Submission To Date"
          ></v-text-field>
        </template>
        <template v-if="!submissionDate">
          <v-text-field
            class="tw-ml-2"
            append-icon="mdi-calendar"
            label="Stop To Date"
          ></v-text-field>
        </template>
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

      <v-flex xs12 md2>
        <v-select
          v-model="officerName"
          class="tw-ml-2"
          :items="getOfficers"
          label="Officer"
          clearable
        ></v-select>
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
          <v-btn color="primary" @click="handleSubmit"
            >Submit Selected Items</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ripa-submissions-grid',

  data() {
    return {
      search: '',
      submissions: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Submission Date', value: 'submissionDate' },
        { text: 'Stop Date', value: 'stopDate' },
        { text: 'Errors Found', value: 'errorsFound' },
        { text: 'PII Found', value: 'piiFound' },
        { text: 'Officer Name', value: 'officerName' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      submissionDate: true,
      submitted: true,
      piiFound: false,
      errorsFound: false,
      officerName: null,
      selectedItems: [],
    }
  },

  computed: {
    getSubmissions() {
      const filteredItems = this.submissions

      if (!this.submitted) {
        return filteredItems.filter(item => !item.submissionDate)
      }

      if (this.errorsFound) {
        return filteredItems.filter(item => item.errorsFound)
      }

      if (this.piiFound) {
        return filteredItems.filter(item => item.piiFound)
      }

      if (this.officerName) {
        return filteredItems.filter(
          item => item.officerName === this.officerName,
        )
      }

      return this.submissions
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
