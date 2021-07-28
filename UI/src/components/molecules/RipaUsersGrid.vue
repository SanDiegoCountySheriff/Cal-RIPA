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
          <!--
            For now I don't think we need this ability
          <v-btn
            color="primary"
            dark
            class="tw-mb-2"
            @click="editItem(defaultItem)"
          >
            New User
          </v-btn>
          -->

          <ripa-user-dialog
            :admin="true"
            :user="editedItem"
            :showDialog="dialog"
            :on-close="close"
            :on-save="save"
            :is-row-key-disabled="isRowKeyDisabled"
            :form-title="formTitle"
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

export default {
  name: 'ripa-users-grid',

  components: {
    RipaUserDialog,
  },

  data() {
    return {
      search: '',
      users: [],
      dialog: false,
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

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
  },
}
</script>
