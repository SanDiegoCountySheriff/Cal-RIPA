<template>
  <div class="ripa-stops-with-errors-grid">
    <v-data-table
      :headers="headers"
      :items="stopsWithErrors"
      @click:row="handleRowClick"
      sort-by="id"
      single-select
      hide-default-footer
      :mobile-breakpoint="0"
    >
      <template v-slot:top>
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
          <v-card>
            <v-card-title>
              Are you sure you want to delete this stop?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                Yes
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem($event, item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <div>No Stops with Errors Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-stops-with-errors-grid',

  data() {
    return {
      dialogDelete: false,
      stopsWithErrors: [],
      headers: [
        { text: 'Error Text', value: 'errorText' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          width: '60',
          align: 'center',
        },
      ],
      editedIndex: -1,
      editedItem: {},
    }
  },

  methods: {
    init() {
      this.stopsWithErrors = this.items
        .filter(item => item.internalId)
        .map(item => {
          return {
            internalId: item.internalId,
            stopDate: item.apiStop?.date || 'N/A',
            stopTime: item.apiStop.time || 'N/A',
            errorCode: item.statusCode,
            errorText: item.statusError.message
              ? item.statusError.message
              : item.statusError,
          }
        })
    },

    deleteItem(event, item) {
      event.stopPropagation()
      this.editedIndex = this.stopsWithErrors.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.stopsWithErrors.splice(this.editedIndex, 1)
      this.$emit('on-delete-stop', this.editedItem.internalId)
      this.closeDelete()
    },

    handleRowClick(item) {
      this.$emit('on-edit-stop', item.internalId)
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },

  watch: {
    items(val) {
      this.items = val
      this.init()
    },

    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.init()
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.ripa-stops-with-errors-grid {
  .v-data-table__wrapper {
    tr:hover {
      cursor: pointer !important;
    }
  }
}
</style>
