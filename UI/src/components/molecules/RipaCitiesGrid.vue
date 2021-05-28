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
      :items="cities"
      :search="search"
      sort-by="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Cities</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
            :light="getLight"
            :dark="getDark"
            persistent
          >
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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="City"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="editedItem.state"
                        :items="mappedStates"
                        label="State"
                      >
                      </v-autocomplete>
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
                        v-model="editedItem.deactivationDate"
                        label="Deactiviation Date"
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
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
            :light="getLight"
            :dark="getDark"
            persistent
          >
            <v-card>
              <v-card-title
                >Are you sure you want to delete this city?</v-card-title
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
import { STATES } from '@/constants/states'

export default {
  name: 'ripa-cities-grid',

  data() {
    return {
      search: '',
      cities: [],
      mappedCounties: [],
      mappedStates: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'City', value: 'name' },
        { text: 'County', value: 'county' },
        { text: 'State', value: 'state' },
        { text: 'Deactivation Date', value: 'deactivationDate' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100' },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        county: '',
        state: 'CA',
      },
      defaultItem: {
        name: '',
        county: '',
        state: 'CA',
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    getLight() {
      return this.$vuetify.theme.dark
    },

    getDark() {
      return !this.$vuetify.theme.dark
    },
  },

  methods: {
    init() {
      this.cities = this.items
      this.mappedStates = STATES.map(item => item.abbreviation)
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
      this.editedIndex = this.cities.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.cities.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.cities.splice(this.editedIndex, 1)
      if (this.onDeleteCity) {
        this.onDeleteCity(this.editedItem)
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
        Object.assign(this.cities[this.editedIndex], this.editedItem)
      } else {
        this.cities.push(this.editedItem)
      }

      if (this.onEditCity) {
        this.onEditCity(this.editedItem)
      }

      this.close()
    },
  },

  watch: {
    items(val) {
      this.cities = val
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
    onDeleteCity: {
      type: Function,
      default: () => {},
    },
    onEditCity: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
