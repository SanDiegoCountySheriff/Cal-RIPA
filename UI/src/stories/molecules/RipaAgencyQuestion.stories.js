import RipaAgencyQuestions from '@/components/molecules/RipaAgencyQuestions'

export default {
  title: 'Molecules/RipaAgencyQuestions',
  component: RipaAgencyQuestions,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAgencyQuestions },
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
    '<div><ripa-agency-questions v-model="agencyQuestion" :question="agencyQuestion"></ripa-agency-questions>{{agencyQuestion}}</div>',
})

export const notRequired = () => ({
  components: { RipaAgencyQuestions },
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
    '<div><ripa-agency-questions v-model="agencyQuestion" :question="agencyQuestion"></ripa-agency-questions>{{agencyQuestion}}</div>',
})
