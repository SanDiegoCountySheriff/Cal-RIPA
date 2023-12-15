<template>
  <div>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="users"
      :search="search"
      sort-by="lastName"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Users</v-toolbar-title
          >

          <v-spacer></v-spacer>

          <v-dialog v-model="fileDialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="tw-mb-2 mr-4"
                v-bind="attrs"
                v-on="on"
              >
                Import Users
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>Upload Users File</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <p>Required Columns:</p>
                      <ul>
                        <li>'Id' (Object ID from AAD)</li>
                        <li>'OfficerId' (From current RIPA application)</li>
                      </ul>
                      <br />
                      <p>Optional Columns:</p>
                      <ul>
                        <li>'FirstName'</li>
                        <li>'LastName'</li>
                        <li>'YearsExperience'</li>
                        <li>
                          'Assignment' (Number value from current RIPA
                          application)
                        </li>
                        <li>'OtherType'</li>
                        <li>'Agency'</li>
                      </ul>

                      <br />

                      <ripa-checkbox
                        v-model="agencyIncluded"
                        label="Agency included on .csv"
                      ></ripa-checkbox>
                      <template v-if="!agencyIncluded">
                        <p>Enter your agency name or abbreviation.</p>
                        <ripa-text-input
                          v-model="usersAgency"
                          single-line
                          :rules="agencyRules"
                          label="Agency"
                        >
                        </ripa-text-input>
                      </template>

                      <v-file-input
                        v-model="usersFile"
                        prepend-icon="mdi-paperclip"
                        label="Upload users file"
                        accept=".csv"
                        :rules="fileRules"
                      >
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeFileDialog">
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="isInvalidUploadForm"
                  color="blue darken-1"
                  text
                  @click="uploadUsers"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <ripa-user-dialog
            :admin="true"
            :showDialog="dialog"
            :is-row-key-disabled="isRowKeyDisabled"
            :form-title="formTitle"
            @on-close="close"
            @on-save="save"
          >
          </ripa-user-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="tw-mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
      <template v-slot:no-data>
        <div>No Users Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import { computed } from 'vue'

export default {
  name: 'ripa-users-grid',

  components: {
    RipaUserDialog,
    RipaTextInput,
    RipaCheckbox,
  },

  data() {
    return {
      search: '',
      users: [],
      dialog: false,
      fileDialog: false,
      usersFile: null,
      usersAgency: '',
      agencyIncluded: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'Full Name', value: 'name' },
        { text: 'Agency', value: 'agency' },
        { text: 'Start Date', value: 'startDate' },
        { text: 'Officer ID', value: 'officerId' },
        { text: 'Assignment', value: 'assignment' },
        { text: 'Other Type', value: 'otherType' },
        { text: 'Exp Years', value: 'yearsExperience' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          width: '80',
          align: 'center',
        },
      ],
      editedIndex: -1,
      editedItem: {
        id: '',
        firstName: '',
        lastName: '',
        startDate: '',
        agency: '',
        assignment: 0,
        yearsExperience: '',
      },
      defaultItem: {
        id: '',
        firstName: '',
        lastName: '',
        startDate: '',
        agency: '',
        assignment: 0,
        yearsExperience: '',
      },
    }
  },

  provide() {
    return {
      user: computed(() => this.editedItem),
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },

    isRowKeyDisabled() {
      return this.editedIndex > -1
    },

    isDuplicateKey() {
      const filteredItems = this.users.filter(
        item => item.id.toLowerCase() === this.editedItem.id.toLowerCase(),
      )

      if (this.editedIndex === -1) {
        return filteredItems.length > 0 || this.editedItem.id === ''
      }

      return false
    },

    isInvalidUploadForm() {
      return this.isInvalidFile || this.isInvalidAgency
    },

    isInvalidFile() {
      return (
        this.usersFile === null ||
        this.usersFile?.name.split('.').pop() !== 'csv'
      )
    },

    isInvalidAgency() {
      return !this.agencyIncluded && this.usersAgency === ''
    },

    fileRules() {
      return [
        v => !!v || 'A file is required',
        v => (v && v.name.split('.').pop() === 'csv') || 'File must be .csv',
      ]
    },

    agencyRules() {
      return [v => (!!v && !this.agencyIncluded) || 'An agency is required']
    },
  },

  methods: {
    init() {
      this.users = this.items
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.assignment = Number(this.editedItem.assignment)
      this.dialog = true
    },

    uploadUsers() {
      if (this.usersFile) {
        this.onUploadUsers(this.usersFile, this.usersAgency)
        this.usersFile = null
        this.usersAgency = ''
      }

      this.closeFileDialog()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeFileDialog() {
      this.fileDialog = false
      this.usersFile = null
    },

    save() {
      this.editedName = `${this.editedItem.fullName} ${this.editedItem.lastName}`
      if (this.editedIndex > -1) {
        this.editedItem.assignment = Number(this.editedItem.assignment)
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }

      if (this.onEditUser) {
        this.onEditUser(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.users = val
    },
    dialog(val) {
      val || this.close()
    },
    fileDialog(val) {
      val || this.closeFileDialog()
    },
    agencyIncluded() {
      this.usersAgency = ''
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
    onEditUser: {
      type: Function,
      default: () => {},
    },
    onUploadUsers: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style scoped="true">
* >>> .v-dialog {
  overflow-y: visible;
}
</style>
