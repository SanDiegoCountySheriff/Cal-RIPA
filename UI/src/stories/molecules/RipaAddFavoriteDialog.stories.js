import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'

export default {
  title: 'Molecules/RipaAddFavoriteDialog',
  component: RipaAddFavoriteDialog,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAddFavoriteDialog },
  template: '<ripa-add-favorite-dialog show-dialog></ripa-add-favorite-dialog>',
})
