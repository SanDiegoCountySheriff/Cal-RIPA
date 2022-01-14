<template>
  <div class="ripa-favorites-grid">
    <v-text-field
      v-if="favorites.length > 9"
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="favorites"
      :search="search"
      :items-per-page="-1"
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      @click:row="handleRowClick"
      single-select
    >
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-card>
            <v-card-title>
              <span>{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Favorite Name"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <template v-if="isOnlineAndAuthenticated">
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
          <v-card>
            <v-card-title
              >Are you sure you want to delete this favorite?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Yes</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <template v-if="isOnlineAndAuthenticated">
          <v-icon small class="tw-mr-2" @click="editItem($event, item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem($event, item)"> mdi-delete </v-icon>
        </template>
      </template>
      <template v-slot:no-data>
        <div>No Favorites Data</div>
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

    editItem(event, item) {
      event.stopPropagation()
      this.editedIndex = this.favorites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(event, item) {
      event.stopPropagation()
      this.editedIndex = this.favorites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.favorites.splice(this.editedIndex, 1)
      if (this.onDeleteFavorite) {
        this.onDeleteFavorite(this.editedItem.id)
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

    handleRowClick(item) {
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
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
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
