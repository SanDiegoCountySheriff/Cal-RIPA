<template>
  <div class="ripa-age tw-pb-8">
    <ripa-form-header title="Perceived Age" required subtitle="§999.226(a)(7)">
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-slider
            v-model="model.person.perceivedAge"
            class="tw-mt-4"
            label="Perceived Age"
            :min="1"
            :max="125"
            :rules="ageRules"
            @input="handleInput"
          ></ripa-slider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSlider from '@/components/atoms/RipaSlider'
import { AGES } from '@/constants/form'

export default {
  name: 'ripa-age',

  components: {
    RipaFormHeader,
    RipaSlider,
  },

  data() {
    return {
      valid: true,
      ageItems: AGES,
      viewModel: {
        person: {
          perceivedAge: this.value?.person?.perceivedAge || null,
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

    ageRules() {
      return [v => !!v || 'An age is required']
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = {
        person: {
          perceivedAge: newVal?.person?.perceivedAge || null,
        },
      }
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
