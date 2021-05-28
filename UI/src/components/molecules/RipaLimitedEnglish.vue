<template>
  <div class="ripa-no-english tw-pb-4">
    <ripa-form-header
      title="Limited or No English Fluency"
      subtitle="§999.226(a)(8)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-limited-english',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      viewModel: this.loadModel(this.value),
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
      this.viewModel = this.loadModel(newVal)
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
