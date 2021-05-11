<template>
  <div class="ripa-favorites-grid">
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
      :items="favorites"
      :search="search"
      @click:row="handleRowClick"
      sort-by="name"
      single-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Favorites</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.name"
                        auto-grow
                        label="Favorite Name"
                        required
                        rows="2"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                >Are you sure you want to delete this favorite?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
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
import { format } from 'date-fns'

export default {
  name: 'ripa-favorites-grid',

  data() {
    return {
      search: '',
      favorites: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Update Date', value: 'updateDate', width: '150' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: '',
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  methods: {
    init() {
      this.favorites = this.items
    },

    editItem(item) {
      this.editedIndex = this.favorites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.favorites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1)
      if (this.onDeleteFavorite) {
        this.onDeleteFavorite(this.editedItem)
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

    handleRowClick(item, row) {
      row.select(true)
      if (this.onOpenFavorite) {
        this.onOpenFavorite(item.id)
      }
    },

    save() {
      this.editedItem.updateDate = format(new Date(), 'yyyy-MM-dd')
      if (this.editedIndex > -1) {
        Object.assign(this.favorites[this.editedIndex], this.editedItem)
      } else {
        this.onDeleteFavorite.push(this.editedItem)
      }

      if (this.onEditFavorite) {
        this.onEditFavorite(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.favorites = val
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
    onDeleteFavorite: {
      type: Function,
      default: () => {},
    },
    onEditFavorite: {
      type: Function,
      default: () => {},
    },
    onOpenFavorite: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-favorites-grid {
  .v-data-table__wrapper {
    tr:hover {
      cursor: pointer !important;
    }
  }
}
</style>
