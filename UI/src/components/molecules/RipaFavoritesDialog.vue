<template>
  <v-dialog v-model="model" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>{{ getTitle() }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ripa-favorites-grid
                :items="favorites"
                v-on="$listeners"
              ></ripa-favorites-grid>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaFavoritesGrid from '@/components/molecules/RipaFavoritesGrid'

export default {
  name: 'ripa-favorites-dialog',

  components: {
    RipaFavoritesGrid,
  },

  data() {
    return {
      viewModel: this.showDialog,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newValue) {
        if (!newValue) {
          this.handleClose()
        }
        this.viewModel = newValue
      },
    },
  },

  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    getTitle() {
      return 'Favorite ' + this.title
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModel = newValue
    },
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    favorites: {
      type: Array,
      default: () => [],
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
