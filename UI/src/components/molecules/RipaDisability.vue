<template>
  <div class="ripa-disability tw-pb-4">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      subtitle="§999.226(a)(9)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.anyDisabilities"
            label="Any Disabilities?"
            :disabled="disabled"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.person.anyDisabilities">
            <ripa-check-group
              v-model="model.person.perceivedOrKnownDisability"
              :disabled="disabled"
              :items="getDisabilityItems"
              :rules="disabilityRules"
              @input="handleInput"
            >
            </ripa-check-group>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { DISABILITIES } from '@/constants/form'

export default {
  name: 'ripa-disability',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSwitch,
  },

  data() {
    return {
      disabilityItems: DISABILITIES,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    getDisabilityItems() {
      if (this.viewModel.person.isStudent) {
        return this.disabilityItems
      }

      return this.disabilityItems.filter(item => item.value !== 7)
    },

    disabilityRules() {
      const checked = this.viewModel.person.anyDisabilities
      const options = this.viewModel.person.perceivedOrKnownDisability
      return [
        (checked && options.length > 0) ||
          'At least one disability is required',
      ]
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },

    updatePerceivedOrKnownDisabilityModel() {
      this.$nextTick(() => {
        this.viewModel.person.perceivedOrKnownDisability = []
      })
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
    },

    'viewModel.person.anyDisabilities': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.updatePerceivedOrKnownDisabilityModel()
        }
      },
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
