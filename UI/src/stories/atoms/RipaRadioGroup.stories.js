import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'

export default {
  title: 'Atoms/RipaRadioGroup',
  component: RipaRadioGroup,
  parameters: {},
}

export const basic = () => ({
  components: { RipaRadioGroup },
  data() {
    return {
      items: [
        { name: 'Moving Violation', value: '1A' },
        { name: 'Equipment Violation', value: '1B' },
        {
          name: 'Non-moving Violation, including Registration Violation',
          value: '1C',
        },
      ],
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-radio-group v-model="selection" :items="items"></ripa-radio-group>{{selection}}</div>',
})
