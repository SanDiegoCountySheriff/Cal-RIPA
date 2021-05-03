<template>
  <div class="ripa-race tw-pb-8">
    <ripa-form-header title="Student" required subtitle="§999.224(a)(16)">
    </ripa-form-header>

    <v-container class="surface">
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.isStudent"
            label="K-12 Public School Student"
            :max-width="250"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-student',

  components: {
    RipaSwitch,
    RipaFormHeader,
  },

  data() {
    return {
      viewModel: {
        person: {
          isStudent: this.value?.person?.isStudent || false,
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
