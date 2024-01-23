<template>
  <v-dialog v-model="model" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>{{ getTitle() }}</span>
      </v-card-title>

      <v-card-text>
        <v-alert v-if="favoritesCodeExpired" color="error" outlined
          >You have favorites with expired statute codes. To update, save a
          favorite with the same name.</v-alert
        >
        <v-alert v-if="favoritesCityExpired" color="error" outlined
          >You have favorites with an expired city. To update, save a favorite
          with the same name.</v-alert
        >
        <v-alert v-if="favoritesSchoolExpired" color="error" outlined
          >You have favorites with an expired school. To update, save a favorite
          with the same name.</v-alert
        >
        <v-alert v-if="this.version === 2" color="warning" outlined
          >Due to recent regulation changes, old favorites are obsolete. Please
          recreate your favorites.</v-alert
        >
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
        <v-btn color="blue darken-1" text @click="handleClose"> Close </v-btn>
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

  inject: ['version'],

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

    favoritesCodeExpired() {
      return this.favorites.some(favorite => {
        return favorite.favoritesCodeExpired === true
      })
    },

    favoritesCityExpired() {
      return this.favorites.some(favorite => {
        return favorite.favoritesCityExpired === true
      })
    },

    favoritesSchoolExpired() {
      return this.favorites.some(favorite => {
        return favorite.favoritesSchoolExpired === true
      })
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
