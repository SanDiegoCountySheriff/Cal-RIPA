import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'

export default {
  title: 'Atoms/RipaCheckGroup',
  component: RipaCheckGroup,
  parameters: {},
}

export const basic = () => ({
  components: { RipaCheckGroup },
  data() {
    return {
      items: [
        { name: 'Officer witnessed commission of a crime', value: '2A' },
        { name: 'Matched suspect description', value: '2B' },
        {
          name: 'Witness or Victim identification of Suspect at the scene',
          value: '2C',
        },
        { name: 'Carrying Suspicious Object', value: '2D' },
        {
          name: 'Actions indicative of casing a victim or location',
          value: '2E',
        },
        { name: 'Suspected of Acting as Lookout', value: '2F' },
        { name: 'Actions indicative of drug transaction', value: '2G' },
        {
          name: 'Actions indicative of engaging in violent crime',
          value: '2H',
        },
        { name: 'Other Reasonable Suspicion of a crime', value: '2I' },
      ],
      selection: [],
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-check-group v-model="selection" :items="items"></ripa-check-group>{{selection}}</div>',
})
