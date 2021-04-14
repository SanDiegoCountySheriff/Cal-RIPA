import RipaAccordion from '@/components/molecules/RipaAccordion'

export default {
  title: 'Molecules/RipaAccordion',
  component: RipaAccordion,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAccordion },
  template: '<ripa-accordion></ripa-accordion>',
})
