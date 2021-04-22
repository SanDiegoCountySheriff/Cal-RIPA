import RipaSelect from '@/components/atoms/RipaSelect'

export default {
  title: 'Atoms/RipaSelect',
  component: RipaSelect,
  parameters: {},
}

export const stringValues = () => ({
  components: { RipaSelect },
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
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-select v-model="selection" :items="items" itemText="name" itemValue="value" label="Reason for Stop" hint="Please select a reason for stop"></ripa-select>{{selection}}</div>',
})

export const numericValues = () => ({
  components: { RipaSelect },
  data() {
    return {
      items: [
        { name: 'Officer witnessed commission of a crime', value: 1 },
        { name: 'Matched suspect description', value: 2 },
        {
          name: 'Witness or Victim identification of Suspect at the scene',
          value: 3,
        },
        { name: 'Carrying Suspicious Object', value: 4 },
        {
          name: 'Actions indicative of casing a victim or location',
          value: 5,
        },
        { name: 'Suspected of Acting as Lookout', value: 6 },
        { name: 'Actions indicative of drug transaction', value: 7 },
        {
          name: 'Actions indicative of engaging in violent crime',
          value: 8,
        },
        { name: 'Other Reasonable Suspicion of a crime', value: 9 },
      ],
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-select v-model="selection" :items="items" itemText="name" itemValue="value" label="Reason for Stop" hint="Please select a reason for stop"></ripa-select>{{selection}}</div>',
})
