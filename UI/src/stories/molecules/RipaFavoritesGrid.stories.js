import RipaFavoritesGrid from '@/components/molecules/RipaFavoritesGrid'
import { favoriteLocations } from '../data/mappings'

export default {
  title: 'Molecules/RipaFavoritesGrid',
  component: RipaFavoritesGrid,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFavoritesGrid },
  data() {
    return {
      data: favoriteLocations(),
    }
  },
  template: '<ripa-favorites-grid :items="data"></ripa-favorites-grid>',
})

export const loading = () => ({
  components: { RipaFavoritesGrid },
  data() {
    return {
      data: [],
    }
  },
  template: '<ripa-favorites-grid loading :items="data"></ripa-favorites-grid>',
})
