<template>
  <div class="ripa-no-english tw-pb-8">
    <ripa-form-header
      title="Limited or No English Fluency"
      required
      subtitle="§999.226(a)(8)"
    >
    </ripa-form-header>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.perceivedLimitedEnglish"
            label="Limited or no English fluency"
            :max-width="300"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-limited-english',

  components: {
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      viewModel: {
        person: {
          perceivedLimitedEnglish:
            this.value?.person?.perceivedLimitedEnglish || false,
        },
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
