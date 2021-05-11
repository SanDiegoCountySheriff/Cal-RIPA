<template>
  <v-dialog v-model="model" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>Favorite Locations</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ripa-favorites-grid
                :items="favorites"
                :on-open-favorite="onOpenFavorite"
              ></ripa-favorites-grid>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
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
          if (this.onClose) {
            this.onClose()
          }
        }
        this.viewModel = newValue
      },
    },

    getSaveDiabled() {
      return this.favoriteName.length === 0
    },
  },

  methods: {
    init() {
      this.favoriteName = ''
    },

    handleClose() {
      if (this.onClose) {
        this.onClose()
      }
    },

    handleDelete() {
      if (this.onDelete) {
        this.onDeleteFavorite(this.favorite)
      }
    },

    handleSave() {
      if (this.onSaveFavorite) {
        this.onSaveFavorite(this.favoriteName)
      }

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
    favorites: {
      type: Array,
      default: () => [],
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
    onClose: {
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
