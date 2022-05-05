<template>
  <div class="tw-pb-4">
    <ripa-form-header
      title="Perceived Unhoused"
      subtitle="§999.226(a)(11)"
      :on-open-statute="onOpenStatute"
    ></ripa-form-header>

    <v-container>
      <v-row no gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.perceivedUnhoused"
            label="Perceived Unhoused"
            :max-width="300"
            @input="handleInput"
          >
          </ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'

export default {
  name: 'ripa-unhoused',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaSwitch,
  },

  data() {
    return {
      viewModel: this.syncModel(this.value),
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
      this.viewModel = this.syncModel(newVal)
    },
  },

  props: {
    value: {
      type: Object,
    },
  },
}
</script>
