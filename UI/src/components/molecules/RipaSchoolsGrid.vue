<template>
  <div class="ripa-schools-grid">
    <p class="ripa-schools-grid--info">
      Data in this table is provided by CA DOJ and maintained periodically on
      CLEW (<a
        href="https://clew.doj.ca.gov/sd-ab953"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://clew.doj.ca.gov/sd-ab953 </a
      >). Exercise caution when manually updating data. Any mismatches will
      produce errors upon submission to CA DOJ.
    </p>
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
      :items="schools"
      :search="search"
      sort-by="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Schools</v-toolbar-title
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
                        v-model="editedItem.rowKey"
                        label="ID"
                        :disabled="isRowKeyDisabled"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="School"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.district"
                        label="District"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        v-model="editedItem.county"
                        :items="mappedCounties"
                        @change="handleCountyChange"
                        label="County"
                      >
                      </v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.cdsCode"
                        label="CDS Code"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.status"
                        label="Status"
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
                >Are you sure you want to delete this school?</v-card-title
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
        <div>No Schools Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-schools-grid',

  data() {
    return {
      search: '',
      schools: [],
      mappedCounties: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'School', value: 'name' },
        { text: 'District', value: 'district' },
        { text: 'County', value: 'county' },
        { text: 'CDS Code', value: 'cdsCode' },
        { text: 'Status', value: 'status' },
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
        rowKey: '',
        name: '',
        district: '',
        county: '',
      },
      defaultItem: {
        rowKey: '',
        name: '',
        district: '',
        county: '',
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
      const filteredItems = this.schools.filter(
        item =>
          item.rowKey.toLowerCase() === this.editedItem.rowKey.toLowerCase(),
      )

      if (this.editedIndex === -1) {
        return filteredItems.length > 0 || this.editedItem.rowKey === ''
      }

      return false
    },
  },

  methods: {
    init() {
      this.schools = this.items
      this.mappedCounties = this.items
        .map(item => item.county.toUpperCase())
        .sort()
    },

    handleCountyChange() {
      this.editedItem.county = this.editedItem.county
        ? this.editedItem.county.toUpperCase()
        : ''
    },

    editItem(item) {
      this.editedIndex = this.schools.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.schools.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.schools.splice(this.editedIndex, 1)
      if (this.onDeleteSchool) {
        this.onDeleteSchool(this.editedItem)
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
        Object.assign(this.schools[this.editedIndex], this.editedItem)
      } else {
        this.schools.push(this.editedItem)
      }

      if (this.onEditSchool) {
        this.onEditSchool(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.schools = val
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
    onDeleteSchool: {
      type: Function,
      default: () => {},
    },
    onEditSchool: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-schools-grid {
  .ripa-schools-grid--info {
    margin: 16px 16px 0 16px;
  }
}
</style>
