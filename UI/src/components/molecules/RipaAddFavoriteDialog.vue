<template>
  <v-dialog v-model="model" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span>Add Favorite</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="favoriteName"
                label="Favorite Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Cancel </v-btn>
        <v-btn
          color="blue darken-1"
          :disabled="getSaveDisabled"
          text
          @click="handleSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ripa-add-favorite-dialog',

  data() {
    return {
      viewModel: this.showDialog,
      favoriteName: '',
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newValue) {
        if (!newValue) {
          this.onClose()
        }
        this.viewModel = newValue
      },
    },
    getSaveDisabled() {
      return this.favoriteName.length === 0
    },
  },

  methods: {
    init() {
      this.favoriteName = ''
    },

    handleClose() {
      this.onClose()
    },

    handleSave() {
      this.onAddFavorite(this.favoriteName)
      this.handleClose()
    },
  },

  created() {
    this.init()
  },

  watch: {
    showDialog(newValue) {
      this.viewModel = newValue
    },
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onAddFavorite: {
      type: Function,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
}
</script>
