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
      :items="statutes"
      :search="search"
      sort-by="offenseCode"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Statutues</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px" persistent>
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
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.rowKey"
                        label="ID"
                        :disabled="isRowKeyDisabled"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseCode"
                        label="Offense Code"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseStatute"
                        label="Offense Statute"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseValidationCD"
                        label="Offense Validation CD"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseTxnTypeCD"
                        label="Offense Txn Type CD"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseTypeOfStatuteCD"
                        label="Offense Type of Statute CD"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.statuteLiteral"
                        label="Statute Literal"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseDefaultTypeOfCharge"
                        label="Offense Default Type of Charge"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseTypeOfCharge"
                        label="Offense Type of Charge"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseLiteralIdentifierCD"
                        label="Offense Literal ID CD"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.offenseDegree"
                        label="Offense Degree"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.bcsHierarchyCD"
                        label="BCS Hierarchy CD"
                      ></v-text-field>
                      <ripa-date-picker
                        v-model="editedItem.offenseEnacted"
                        label="Offense Enacted"
                      ></ripa-date-picker>
                      <ripa-date-picker
                        v-model="editedItem.offenseRepealed"
                        label="Offense Repealed"
                      ></ripa-date-picker>
                      <v-text-field
                        v-model="editedItem.alpsCognizantCD"
                        label="Alps Cognizant CD"
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
                >Are you sure you want to delete this statute?</v-card-title
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
import RipaDatePicker from '@/components/atoms/RipaDatePicker'

export default {
  name: 'ripa-statutes-grid',

  components: {
    RipaDatePicker,
  },

  data() {
    return {
      search: '',
      statutes: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'Offense Code', value: 'offenseCode' },
        { text: 'Offense Statute', value: 'offenseStatute' },
        { text: 'Offense Validation CD', value: 'offenseValidationCD' },
        { text: 'Offense Txn Type CD', value: 'offenseTxnTypeCD' },
        { text: 'Offense Type of Statute CD', value: 'offenseTypeOfStatuteCD' },
        { text: 'Statute Literal', value: 'statuteLiteral' },
        {
          text: 'Offense Default Type of Charge',
          value: 'offenseDefaultTypeOfCharge',
        },
        { text: 'Offense Type of Charge', value: 'offenseTypeOfCharge' },
        { text: 'Offense Literal ID CD', value: 'offenseLiteralIdentifierCD' },
        { text: 'Offense Code', value: 'offenseDegree' },
        { text: 'BCS Hierarchy CD', value: 'bcsHierarchyCD' },
        { text: 'Offense Enacted', value: 'offenseEnacted', width: '110' },
        { text: 'Offense Repealed', value: 'offenseRepealed', width: '110' },
        { text: 'Alps Cognizant CD', value: 'alpsCognizantCD' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
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
      const filteredItems = this.statutes.filter(
        item => item.rowKey === this.editedItem.rowKey,
      )

      if (this.editedIndex === -1) {
        return filteredItems.length > 0 || this.editedItem.rowKey === ''
      }

      return false
    },
  },

  methods: {
    init() {
      this.statutes = this.items
    },

    editItem(item) {
      this.editedIndex = this.statutes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.statutes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.statutes.splice(this.editedIndex, 1)
      if (this.onDeleteStatute) {
        this.onDeleteStatute(this.editedItem)
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
        Object.assign(this.statutes[this.editedIndex], this.editedItem)
      } else {
        this.statutes.push(this.editedItem)
      }

      if (this.onEditStatute) {
        this.onEditStatute(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.statutes = val
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
    onDeleteStatute: {
      type: Function,
      default: () => {},
    },
    onEditStatute: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
