import RipaAgencyQuestion from '@/components/molecules/RipaAgencyQuestion'

export default {
  title: 'Molecules/RipaAgencyQuestion',
  component: RipaAgencyQuestion,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAgencyQuestion },
  data() {
    return {
      agencyQuestion: {
        Name: 'FavoriteCar',
        Type: 'Text',
        Prompt: 'What is your favorite car?',
        Hint: 'It better be a cool car too!',
        MaxLength: 250,
        Required: true,
      },
    }
  },
  template:
    '<div><ripa-agency-question v-model="agencyQuestion" :question="agencyQuestion"></ripa-agency-question>{{agencyQuestion}}</div>',
})

export const notRequired = () => ({
  components: { RipaAgencyQuestion },
  data() {
    return {
      agencyQuestion: {
        Name: 'FavoriteColor',
        Type: 'Text',
        Prompt: 'What is your favorite color?',
        Hint: 'It better be a pretty color!',
        MaxLength: 250,
        Required: false,
      },
    }
  },
  template:
    '<div><ripa-agency-question v-model="agencyQuestion" :question="agencyQuestion"></ripa-agency-question>{{agencyQuestion}}</div>',
})
