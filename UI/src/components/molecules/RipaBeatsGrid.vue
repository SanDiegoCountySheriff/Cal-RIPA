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
      :items="beats"
      :search="search"
      sort-by="community"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Beats</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="tw-mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.id"
                        type="number"
                        label="ID"
                        :disabled="isRowKeyDisabled"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.community"
                        label="Community"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.command"
                        label="Command"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.commandAuditGroup"
                        label="Command Audit Group"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.commandAuditSize"
                        label="Command Audit Size"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="isDuplicateKey"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px" persistent>
            <v-card>
              <v-card-title
                >Are you sure you want to delete this beat?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >No</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Yes</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="tw-mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <div>No Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-beats-grid',

  data() {
    return {
      search: '',
      beats: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Community', value: 'community' },
        { text: 'Command', value: 'command' },
        { text: 'Command Audit Group', value: 'commandAuditGroup' },
        { text: 'Command Audit Size', value: 'commandAuditSize' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      editedItem: {
        id: '',
        community: '',
        command: '',
        commandAuditGroup: '',
        commandAuditSize: '',
      },
      defaultItem: {
        id: '',
        community: '',
        command: '',
        commandAuditGroup: '',
        commandAuditSize: '',
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    isRowKeyDisabled() {
      return this.editedIndex > -1
    },

    isDuplicateKey() {
      const filteredItems = this.cities.filter(
        item => item.id === this.editedItem.id,
      )

      if (this.editedIndex === -1) {
        return filteredItems.length > 0 || this.editedItem.id === ''
      }

      return false
    },
  },

  methods: {
    init() {
      this.beats = this.items
    },

    editItem(item) {
      this.editedIndex = this.beats.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.beats.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.beats.splice(this.editedIndex, 1)
      if (this.onDeleteBeat) {
        this.onDeleteBeat(this.editedItem)
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.beats[this.editedIndex], this.editedItem)
      } else {
        this.beats.push(this.editedItem)
      }

      if (this.onEditBeat) {
        this.onEditBeat(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.beats = val
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
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
    onDeleteBeat: {
      type: Function,
      default: () => {},
    },
    onEditBeat: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
