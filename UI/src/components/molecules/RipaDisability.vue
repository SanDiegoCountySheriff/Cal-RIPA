<template>
  <div class="ripa-disability tw-pb-4">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      :subtitle="model.stopVersion === 1 ? '§999.226(a)(9)' : '§999.226(a)(10)'"
      v-on="$listeners"
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
            @input="handleAnyDisabilitiesInput"
          ></ripa-switch>

          <template v-if="model.person.anyDisabilities">
            <ripa-check-group
              v-model="model.person.perceivedOrKnownDisability"
              :disabled="disabled"
              :items="getDisabilityItems"
              :rules="disabilityRules"
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
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { DISABILITIES } from '@/constants/form'

export default {
  name: 'ripa-disability',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
    RipaSwitch,
  },

  data() {
    return {
      disabilityItems: DISABILITIES,
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        if (!newVal.person.isStudent) {
          const options = newVal.person?.perceivedOrKnownDisability || []
          const studentOptionFound = options.includes(7)
          if (studentOptionFound) {
            newVal.person.perceivedOrKnownDisability = options.filter(
              item => item !== 7,
            )
          }
        }

        this.$emit('input', newVal)
      },
    },

    getDisabilityItems() {
      if (this.model.person.isStudent) {
        return this.disabilityItems
      }

      return this.disabilityItems.filter(item => item.value !== 7)
    },

    disabilityRules() {
      const checked = this.model.person.anyDisabilities
      const options = this.model.person.perceivedOrKnownDisability
      return [
        (checked && options.length > 0) ||
          'At least one disability is required',
      ]
    },
  },

  methods: {
    handleAnyDisabilitiesInput() {
      if (!this.model.person.anyDisabilities) {
        this.model.person.perceivedOrKnownDisability = []
      }
    },
  },

  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
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
