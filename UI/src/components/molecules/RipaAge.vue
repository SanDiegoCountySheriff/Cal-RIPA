<template>
  <div class="ripa-age tw-pb-8">
    <ripa-form-header title="Perceived Age" required subtitle="§999.226(a)(7)">
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-select
            v-model="model.person.perceivedAge"
            label="Perceived Age"
            :items="ageItems"
            itemText="name"
            itemValue="value"
            :rules="ageRules"
            @input="handleInput"
          >
          </ripa-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSelect from '@/components/atoms/RipaSelect'
import { AGES } from '@/constants/form'

export default {
  name: 'ripa-age',

  components: {
    RipaFormHeader,
    RipaSelect,
  },

  data() {
    return {
      valid: true,
      ageItems: AGES,
      ageRules: [v => !!v || 'An age is required'],
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
