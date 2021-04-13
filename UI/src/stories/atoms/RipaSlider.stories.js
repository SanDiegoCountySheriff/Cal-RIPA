import RipaSlider from '@/components/atoms/RipaSlider'

export default {
  title: 'Atoms/RipaSlider',
  component: RipaSlider,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSlider },
  data() {
    return {
      selection: 12,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-slider v-model="selection" label="Age" hint="Enter number of years experience." :min="0" :max="70"></ripa-slider>{{selection}}</div>',
})
