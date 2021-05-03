import RipaContraband from '@/components/molecules/RipaContraband'

export default {
  title: 'Molecules/RipaContraband',
  component: RipaContraband,
  parameters: {},
}

export const basic = () => ({
  components: { RipaContraband },
  data() {
    return {
      stop: {},
    }
  },
  template:
    '<div><ripa-contraband v-model="stop"></ripa-contraband>{{stop}}</div>',
})
